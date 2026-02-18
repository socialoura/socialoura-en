import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { customerEmail, productName, amount, currency, orderId } =
      await request.json();

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("[purchase-notification] DISCORD_WEBHOOK_URL is not set");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    const payload = {
      embeds: [
        {
          title: "💰 NOUVEAU ACHAT !",
          fields: [
            { name: "💳 Client Email", value: customerEmail || "—", inline: true },
            { name: "📦 Produit", value: productName || "—", inline: true },
            {
              name: "💵 Montant",
              value: `${Number(amount).toFixed(2)} ${currency || "EUR"}`,
              inline: true,
            },
            { name: "🆔 Order ID", value: orderId || "—", inline: false },
          ],
          color: 65280,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[purchase-notification] Discord error:", res.status, text);
      return NextResponse.json({ error: "Discord webhook failed" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[purchase-notification] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
