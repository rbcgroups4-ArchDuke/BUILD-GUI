import "server-only";
import pino from 'pino';
import path from 'path';
import fs from 'fs';

// ===================================================================
// LOGGING SYSTEM - Build Your Own Audit Trail
// ===================================================================
// 
// Ini adalah jantung logging system. ONE FILE yang akan kamu import
// di mana pun kamu perlu log.
//
// Cara pakai:
//   import { logger, logAction, logError } from '@/lib/logger';
//   logger.info({ msg: 'User checked fraud', account: '123' });
//   logAction('fraud_check', { account, risk_score });
//   logError('api_error', error, { endpoint: '/api/accounts/123' });
//
// ===================================================================

// Buat logs/ folder kalau belum ada
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// ===================================================================
// BASE LOGGER - Pino configuration
// ===================================================================
// 
// Production: Write ke file (logs/app.log)
// Development: Pretty print ke console
//

const isProduction = process.env.NODE_ENV === 'production';

const baseLogger = pino(
  {
    // Timestamp format: ISO 8601 (international standard)
    timestamp: pino.stdTimeFunctions.isoTime,

    // Log level: debug, info, warn, error, fatal
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  },
  // Output destination
  isProduction
    ? // Production: file destination without worker transport
      pino.destination({
        dest: path.join(logsDir, 'app.log'),
        mkdir: true,
        sync: false,
      })
    : undefined // Development: Direct console output without transport
);

// ===================================================================
// LOGGER TYPES - What we log (WHO, WHAT, WHEN, WHERE, HOW)
// ===================================================================

interface LogContext {
  userId?: string; // Siapa yang action?
  ipAddress?: string; // Dari mana request?
  userAgent?: string; // Pakai apa browser?
  requestId?: string; // Unique ID untuk track request
  [key: string]: any; // Field tambahan
}

interface ActionLog {
  action: string; // Apa yang terjadi? (fraud_check, case_closed, etc)
  resource?: string; // Apa yang di-access? (case_123, account_456)
  oldState?: any; // Nilai sebelumnya
  newState?: any; // Nilai sesudahnya
  success?: boolean;
  duration?: number; // Berapa lama operasi (ms)?
  context?: LogContext;
}

// ===================================================================
// LOGGING FUNCTIONS - Reusable everywhere
// ===================================================================

/**
 * Log info message (normal activity)
 * Contoh: API request started, case opened, payment processed
 */
export function logInfo(message: string, data?: any, context?: LogContext) {
  baseLogger.info({ ...data, ...context }, message);
}

/**
 * Log action (important business event)
 * Contoh: fraud_check, case_closed, dispute_approved
 * Ini yang paling penting untuk audit trail!
 */
export function logAction(action: string, log: ActionLog) {
  const { context, ...rest } = log;
  baseLogger.info(
    {
      ...rest,
      ...context,
    },
    action
  );
}

/**
 * Log warning (something unusual but not fatal)
 * Contoh: Account not found (tapi API masih respond 404), payment slower than expected
 */
export function logWarn(message: string, data?: any, context?: LogContext) {
  baseLogger.warn({ ...data, ...context }, message);
}

/**
 * Log error (something broke)
 * Contoh: Database query failed, payment gateway timeout
 */
export function logError(
  message: string,
  error: Error | unknown,
  data?: any,
  context?: LogContext
) {
  baseLogger.error(
    {
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
              name: error.name,
            }
          : error,
      ...data,
      ...context,
    },
    message
  );
}

/**
 * Log critical error (should alert somebody)
 * Contoh: Database down, security breach detected
 */
export function logCritical(
  message: string,
  error: Error | unknown,
  data?: any,
  context?: LogContext
) {
  baseLogger.fatal(
    {
      alert: 'CRITICAL - NEEDS IMMEDIATE ATTENTION',
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : error,
      ...data,
      ...context,
    },
    message
  );
}

/**
 * API Request/Response tracking
 * Paling banyak dipake untuk log API endpoint
 */
export function logApiCall(
  method: string,
  path: string,
  statusCode: number,
  duration: number,
  context?: LogContext
) {
  const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
  baseLogger[level](
    {
      method,
      path,
      statusCode,
      duration,
      ...context,
    },
    `API: ${method} ${path}`
  );
}

// ===================================================================
// HELPER: Extract context from Next.js request
// ===================================================================

/**
 * Helper untuk extract info dari request (untuk pakai di API routes)
 * Ini bakal jadi pattern yang kamu ulangin di setiap endpoint
 *
 * Cara pakai:
 *   const context = getRequestContext(req);
 *   logAction('fraud_check', { action, context });
 */
export function getRequestContext(req: Request): LogContext {
  return {
    userId: (req as any).userId, // Will add after auth implemented
    ipAddress: getClientIp(req),
    userAgent: req.headers.get('user-agent') || undefined,
    requestId: (req as any).requestId, // Will add after request ID middleware
  };
}

/**
 * Extract client IP from request
 * Handle proxy, load balancer, direct connection
 */
function getClientIp(req: Request): string {
  const xForwardedFor = req.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  const xRealIp = req.headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp;
  }

  // Fallback (tidak selalu akurat untuk request dari client)
  return 'unknown';
}

// ===================================================================
// HELPER: Performance tracking
// ===================================================================

/**
 * Simple timer untuk measure operation duration
 * Cara pakai:
 *   const timer = createTimer();
 *   // do something
 *   const duration = timer.end();
 *   logAction('fraud_check', { duration, context });
 */
export function createTimer() {
  const start = Date.now();
  return {
    end: () => Date.now() - start,
  };
}

// ===================================================================
// Export main logger instance (for advanced use)
// ===================================================================
export { baseLogger as logger };

// ===================================================================
// USAGE EXAMPLES (Reference)
// ===================================================================

/*

// 1. Simple info log
logInfo('Server started', { port: 3000 });

// 2. Log critical action (fraud check)
logAction('fraud_check', {
  action: 'fraud_check',
  resource: 'account_1234567890',
  newState: { risk_score: 87, risk_level: 'critical' },
  success: true,
  duration: 245,
  context: {
    userId: 'analyst_john',
    ipAddress: '192.168.1.100',
  },
});

// 3. Log error
try {
  // something
} catch (error) {
  logError(
    'Failed to check fraud',
    error,
    { account: '123' },
    { userId: 'analyst_john' }
  );
}

// 4. Log API call
logApiCall('POST', '/api/risk/check', 200, 150, {
  userId: 'analyst_john',
});

// 5. In Next.js API route:
import { logApiCall, logAction, getRequestContext } from '@/lib/logger';

export async function GET(request: Request) {
  const context = getRequestContext(request);
  const start = Date.now();

  try {
    const data = await fetchData();
    logApiCall('GET', '/api/data', 200, Date.now() - start, context);
    return Response.json(data);
  } catch (error) {
    logApiCall('GET', '/api/data', 500, Date.now() - start, context);
    return Response.json({ error }, { status: 500 });
  }
}

*/
