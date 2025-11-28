import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFilePath = path.join(logsDir, 'backend-requests.log');

const getTimestamp = () => {
  return new Date().toISOString();
};

const formatLog = (level, message, data = null) => {
  const logEntry = {
    timestamp: getTimestamp(),
    level,
    message,
    ...(data && { data }),
  };
  return JSON.stringify(logEntry);
};

const writeLog = (content) => {
  fs.appendFileSync(logFilePath, content + '\n', 'utf-8');
};

export const logger = {
  info: (message, data) => {
    const log = formatLog('INFO', message, data);
    console.log(log);
    writeLog(log);
  },
  error: (message, data) => {
    const log = formatLog('ERROR', message, data);
    console.error(log);
    writeLog(log);
  },
  warn: (message, data) => {
    const log = formatLog('WARN', message, data);
    console.warn(log);
    writeLog(log);
  },
  debug: (message, data) => {
    const log = formatLog('DEBUG', message, data);
    console.log(log);
    writeLog(log);
  },
};
