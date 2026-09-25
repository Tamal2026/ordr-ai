import { NextRequest, NextResponse } from "next/server";
import type { WebhookPayload, ServiceMatch } from "@/lib/types";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL as string;

export async function POST(req: NextRequest) {
  const start = Date.now();

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!payload?.transcript) {
    return NextResponse.json({ error: "Missing transcript" }, { status: 422 });
  }

  if (!N8N_WEBHOOK_URL) {
    return NextResponse.json(
      { error: "N8N_WEBHOOK_URL is not configured on the server" },
      { status: 500 }
    );
  }

  try {
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n responded with ${n8nResponse.status}`);
    }

    const data: { products: ServiceMatch[] } = await n8nResponse.json();

    return NextResponse.json({
      products: data.products?.slice(0, 3) ?? [],
      serverLatencyMs: Date.now() - start,
    });
  } catch (err) {
     console.error("N8N call failed:", err); 
    return NextResponse.json( 
      { error: "Upstream n8n workflow failed", detail: (err as Error).message },
      { status:  502}
    );
  }
}

