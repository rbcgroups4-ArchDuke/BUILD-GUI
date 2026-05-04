import { NextResponse } from "next/server";
import { findAccount } from "@/lib/mock-data/store";

export async function GET(
  _request: Request,
  context: { params: Promise<{ accountNumber: string }> }
) {
  const { accountNumber } = await context.params;
  const account = findAccount(accountNumber);
  if (!account) {
    return NextResponse.json({ error: "Account not found in demo data" }, { status: 404 });
  }
  return NextResponse.json({ account });
}
