import { logger } from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log incoming request
  const requestData = {
    method: req.method,
    path: req.path,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
    headers: {
      'content-type': req.get('content-type'),
      'authorization': req.get('authorization') ? '[REDACTED]' : undefined,
    },
  };

  // Include body for non-GET requests (excluding file uploads)
  if (req.method !== 'GET' && req.body && !req.file && !req.files) {
    requestData.body = {
      ...req.body,
      password: req.body.password ? '[REDACTED]' : undefined,
    };
  }

  logger.info(`[${req.method}] ${req.originalUrl}`, requestData);

  // Capture response
  const originalSend = res.send;
  const originalJson = res.json;
  
  res.json = function (data) {
    const duration = Date.now() - startTime;
    const responseData = {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      responseBody: data,
    };

    // Log response
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    if (logLevel === 'warn') {
      logger.warn(`[${req.method}] ${req.originalUrl} - Status ${res.statusCode}`, responseData);
    } else {
      logger.info(`[${req.method}] ${req.originalUrl} - Status ${res.statusCode}`, responseData);
    }

    res.json = originalJson;
    return res.json(data);
  };

  res.send = function (data) {
    const duration = Date.now() - startTime;
    const responseData = {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    };

    // Log response
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    if (logLevel === 'warn') {
      logger.warn(`[${req.method}] ${req.originalUrl} - Status ${res.statusCode}`, responseData);
    } else {
      logger.info(`[${req.method}] ${req.originalUrl} - Status ${res.statusCode}`, responseData);
    }

    res.send = originalSend;
    return res.send(data);
  };

  next();
};
