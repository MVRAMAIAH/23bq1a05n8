const fs = require('fs');
const path = require('path');

// Determine log directory and file
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const logFilePath = path.join(logDir, 'application.log');

/**
 * Custom file-based logging middleware to replace console.log
 */
const logger = {
  log: (level, message, meta = {}) => {
    const timestamp = new Date().toISOString();
    let metaString = '';
    
    try {
      if (Object.keys(meta).length > 0) {
        metaString = ` | ${JSON.stringify(meta)}`;
      }
    } catch (e) {
      metaString = ' | [Unserializable Meta]';
    }

    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}\n`;
    
    // Append to file synchronously to ensure sequence, 
    // in a highly scalable app we'd use streams or external services (like Winston)
    fs.appendFileSync(logFilePath, logEntry, 'utf8');
  },
  
  info: (message, meta) => logger.log('info', message, meta),
  warn: (message, meta) => logger.log('warn', message, meta),
  error: (message, meta) => logger.log('error', message, meta),
  debug: (message, meta) => logger.log('debug', message, meta)
};

module.exports = logger;
