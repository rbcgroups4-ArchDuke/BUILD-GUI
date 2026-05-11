import { NextResponse } from "next/server";
import { generateRekberAssistantReply } from "@/lib/ai/rekber-assistant";
import { addRekberChatMessage, getEscrowCase, getRekberChatMessages } from "@/lib/mock-data/store";
import type { ChatSenderRole } from "@/types";
import { logApiCall, logAction, getRequestContext, createTimer } from "@/lib/logger";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const timer = createTimer();
  const requestContext = getRequestContext(request);
  const { id } = await context.params;

  try {
    const messages = getRekberChatMessages(id);
    if (!messages) {
      logApiCall("GET", `/api/rekber/${id}/chat`, 404, timer.end(), requestContext);
      return NextResponse.json({ error: "Rekber case not found" }, { status: 404 });
    }

    logApiCall("GET", `/api/rekber/${id}/chat`, 200, timer.end(), requestContext);
    return NextResponse.json({ messages });
  } catch (error) {
    logApiCall("GET", `/api/rekber/${id}/chat`, 500, timer.end(), requestContext);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const timer = createTimer();
  const requestContext = getRequestContext(request);
  const { id } = await context.params;

  try {
    const body = await request.json();
    const senderRole = (body.senderRole === "seller" ? "seller" : "buyer") as ChatSenderRole;
    const message = String(body.message ?? "").trim();
    const escrow = getEscrowCase(id);

    if (!message) {
      logApiCall("POST", `/api/rekber/${id}/chat`, 400, timer.end(), requestContext);
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!escrow) {
      logAction("chat_message_case_not_found", {
        action: "chat_message_case_not_found",
        resource: `escrow_${id}`,
        success: false,
        duration: timer.end(),
        context: requestContext
      });

      logApiCall("POST", `/api/rekber/${id}/chat`, 404, timer.end(), requestContext);
      return NextResponse.json({ error: "Rekber case not found" }, { status: 404 });
    }

    const recentMessages = getRekberChatMessages(id) ?? [];
    const aiReply = await generateRekberAssistantReply({
      escrow,
      senderRole,
      message,
      recentMessages
    });
    const messages = addRekberChatMessage(id, senderRole, message, aiReply ?? undefined);
    const updatedEscrow = getEscrowCase(id);

    if (!messages) {
      logApiCall("POST", `/api/rekber/${id}/chat`, 500, timer.end(), requestContext);
      return NextResponse.json({ error: "Failed to store chat message" }, { status: 500 });
    }

    logAction("chat_message_sent", {
      action: "chat_message_sent",
      resource: `escrow_${id}`,
      newState: { sender: senderRole, message_count: messages.length },
      success: true,
      duration: timer.end(),
      context: requestContext
    });

    logApiCall("POST", `/api/rekber/${id}/chat`, 200, timer.end(), requestContext);
    return NextResponse.json({ messages, escrow: updatedEscrow ?? escrow });
  } catch (error) {
    logApiCall("POST", `/api/rekber/${id}/chat`, 500, timer.end(), requestContext);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
