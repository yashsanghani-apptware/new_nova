import { createLogger, format, transports, Logger } from "winston";
import { TransformableInfo } from "logform";

const { combine, timestamp, printf, colorize } = format;

const customFormat = printf((info: TransformableInfo) => {
  const { level, message, timestamp } = info;
  return `${timestamp} ${level}: ${message}`;
});

const logger: Logger = createLogger({
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    customFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "portfolio.log" }),
  ],
  exitOnError: false,
});

export default logger;
