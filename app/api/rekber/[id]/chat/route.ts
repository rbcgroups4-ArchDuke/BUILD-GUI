import { NextResponse } from "next/server";
import { addRekberChatMessage, getRekberChatMessages } from "@/lib/mock-data/store";
import type { ChatSenderRole } from "@/types";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const messages = getRekberChatMessages(id);
  if (!messages) {
    return NextResponse.json({ error: "Rekber case not found" }, { status: 404 });
  }
  return NextResponse.json({ messages });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();
  const senderRole = (body.senderRole === "seller" ? "seller" : "buyer") as ChatSenderRole;
  const message = String(body.message ?? "").trim();
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  const messages = addRekberChatMessage(id, senderRole, message);
  if (!messages) {
    return NextResponse.json({ error: "Rekber case not found" }, { status: 404 });
  }
  return NextResponse.json({ messages });
}
