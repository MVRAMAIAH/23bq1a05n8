/**
 * Client-side logger that sends logs to our Next.js API route,
 * which in turn uses the custom logging middleware to write to the filesystem.
 * This completely avoids using console.log on the client.
 */

const sendLog = (level, message, meta) => {
  fetch('/api/log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ level, message, meta }),
  }).catch(() => {
    // If the logging endpoint fails, there's not much we can do since console.log is forbidden.
    // Silently fail.
  });
};

const logger = {
  info: (message, meta = {}) => sendLog('info', message, meta),
  warn: (message, meta = {}) => sendLog('warn', message, meta),
  error: (message, meta = {}) => sendLog('error', message, meta),
  debug: (message, meta = {}) => sendLog('debug', message, meta)
};

export default logger;
