import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, message } = await request.json();

    if (!email || !message) {
      return NextResponse.json({ error: "Missing email or message" }, { status: 400 });
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("[chat/send] DISCORD_WEBHOOK_URL is not set");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    const payload = {
      embeds: [
        {
          title: "🆕 New Chat Message",
          fields: [
            { name: "Email", value: email, inline: true },
            { name: "Message", value: message, inline: false },
          ],
          color: 16738047,
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
      console.error("[chat/send] Discord webhook error:", res.status, text);
      return NextResponse.json({ error: "Failed to send to Discord" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[chat/send] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
