import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createOrder } from "@/lib/orders-db";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, platform, type, quantity, price, country } = body;

    // username can be empty for some product types (likes/views use URLs in a separate field)
    if (!email || !platform || !type || !quantity || !price) {
      console.error("[orders/confirm] Missing required fields:", { email: !!email, platform: !!platform, type: !!type, quantity: !!quantity, price: !!price });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create order in DB (PostgreSQL via orders-db, with in-memory fallback)
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const order = {
      id: orderId,
      username: username || "",
      email,
      platform,
      type,
      quantity,
      price,
      created_at: new Date().toISOString(),
      order_status: "pending" as const,
      country: country || "US",
    };

    await createOrder(order);
    console.log("[orders/confirm] Order created:", orderId);

    // Send Discord purchase notification (fire-and-forget)
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
      const typeName = type.charAt(0).toUpperCase() + type.slice(1);
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: "💰 NOUVEAU ACHAT !",
              fields: [
                { name: "💳 Client Email", value: email, inline: true },
                { name: "📦 Produit", value: `${platformName} ${typeName}`, inline: true },
                { name: "💵 Montant", value: `${price.toFixed(2)} USD`, inline: true },
                { name: "👤 Target", value: username || "—", inline: true },
                { name: "📦 Quantité", value: String(quantity), inline: true },
                { name: "🆔 Order ID", value: orderId, inline: false },
              ],
              color: 65280,
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      }).catch((err) =>
        console.error("[orders/confirm] Discord notification failed:", err)
      );
    }

    // Send confirmation email via Resend
    if (resend) {
      try {
        const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
        const typeName = type.charAt(0).toUpperCase() + type.slice(1);

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "SocialNovaly <orders@socialnovaly.com>",
          to: email,
          subject: `Order #${orderId} Confirmed - SocialNovaly`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #F9FAFB; padding: 40px 20px;">
              <div style="background: white; border-radius: 16px; padding: 40px; border: 1px solid #E5E7EB;">
                <div style="text-align: center; margin-bottom: 32px;">
                  <h1 style="color: #111827; font-size: 24px; font-weight: 800; margin: 0 0 8px;">Thanks for your order!</h1>
                  <p style="color: #4B5563; font-size: 14px; margin: 0;">Your ${platformName} growth campaign is processing.</p>
                </div>
                
                <div style="background: #F9FAFB; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #4B5563; font-size: 14px;">Order ID</td>
                      <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${orderId}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4B5563; font-size: 14px;">Service</td>
                      <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${platformName} ${typeName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4B5563; font-size: 14px;">Quantity</td>
                      <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${quantity.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #4B5563; font-size: 14px;">Target</td>
                      <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${username}</td>
                    </tr>
                    <tr style="border-top: 1px solid #E5E7EB;">
                      <td style="padding: 12px 0 8px; color: #111827; font-size: 16px; font-weight: 700;">Total</td>
                      <td style="padding: 12px 0 8px; color: #FF4B6A; font-size: 16px; font-weight: 700; text-align: right;">$${price.toFixed(2)}</td>
                    </tr>
                  </table>
                </div>

                <div style="text-align: center; margin-bottom: 24px;">
                  <p style="color: #4B5563; font-size: 13px; margin: 0 0 4px;">Delivery typically starts within minutes.</p>
                  <p style="color: #4B5563; font-size: 13px; margin: 0;">You'll see gradual, organic-style growth on your account.</p>
                </div>

                <div style="text-align: center;">
                  <p style="color: #4B5563; font-size: 12px; margin: 0;">Need help? Contact us at support@socialnovaly.com</p>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 24px;">
                <p style="color: #9CA3AF; font-size: 11px; margin: 0;">SocialNovaly — AI-Powered Social Growth</p>
              </div>
            </div>
          `,
        });
      } catch (emailError: any) {
        console.error("[orders/confirm] Email send failed:", emailError?.message || emailError);
        // Don't fail the order if email fails
      }
    } else {
      console.warn("[orders/confirm] Resend not configured — RESEND_API_KEY is missing. Email NOT sent.");
    }

    return NextResponse.json({
      success: true,
      orderId,
      order,
    });
  } catch (error) {
    console.error("Error confirming order:", error);
    return NextResponse.json(
      { error: "Failed to confirm order" },
      { status: 500 }
    );
  }
}
