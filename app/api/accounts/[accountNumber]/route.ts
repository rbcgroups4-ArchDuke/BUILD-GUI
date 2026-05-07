import { NextResponse } from "next/server";
import { findAccount } from "@/lib/mock-data/store";
import { logApiCall, logAction, getRequestContext, createTimer } from "@/lib/logger";

export async function GET(
  request: Request,
  context: { params: Promise<{ accountNumber: string }> }
) {
  const timer = createTimer();
  const requestContext = getRequestContext(request);
  const { accountNumber } = await context.params;

  try {
    // Log the incoming request
    const account = findAccount(accountNumber);

    if (!account) {
      // Log failed attempt
      logAction("account_lookup_failed", {
        action: "account_lookup_failed",
        resource: `account_${accountNumber}`,
        success: false,
        duration: timer.end(),
        context: requestContext,
      });

      logApiCall("GET", `/api/accounts/${accountNumber}`, 404, timer.end(), requestContext);
      return NextResponse.json({ error: "Account not found in demo data" }, { status: 404 });
    }

    // Log successful lookup
    logAction("account_lookup_success", {
      action: "account_lookup_success",
      resource: `account_${accountNumber}`,
      newState: {
        account_number_masked: account.accountNumber.slice(-4),
        account_type: account.type,
      },
      success: true,
      duration: timer.end(),
      context: requestContext,
    });

    logApiCall("GET", `/api/accounts/${accountNumber}`, 200, timer.end(), requestContext);
    return NextResponse.json({ account });
  } catch (error) {
    logApiCall("GET", `/api/accounts/${accountNumber}`, 500, timer.end(), requestContext);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
