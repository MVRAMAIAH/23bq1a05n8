import { NextResponse } from 'next/server';
// We resolve the path relative to the Next.js app root. 
// The logging_middleware is outside notification_app_be.
import path from 'path';

let logger;
try {
  // Since notification_app_be is inside 23bq1a05n8, logging_middleware is at ../logging_middleware
  logger = require('../../../../logging_middleware/logger');
} catch (e) {
  // Fallback if path changes, though we expect it to be exactly there
  logger = {
    log: () => {}, info: () => {}, warn: () => {}, error: () => {}
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { level, message, meta } = body;

    if (logger && typeof logger[level] === 'function') {
      logger[level](message, meta);
    } else if (logger) {
      logger.info(message, meta);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to log' }, { status: 500 });
  }
}
