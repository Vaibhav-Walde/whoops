import { createLogger, format, transports, addColors, Logger } from "winston";

const { combine, printf, colorize, errors } = format;

const customColors = {
  error: "bold red",
  success: "bold green",
  debug: "bold yellow",
};

const customLevels = {
  levels: {
    error: 0,
    success: 1,
    debug: 2,
  },
  colors: customColors,
};

addColors(customLevels.colors);

const getISTTimestamp = () => {
  const date = new Date();
  const istDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, "0");
  const day = String(istDate.getDate()).padStart(2, "0");
  const hours = String(istDate.getHours()).padStart(2, "0");
  const minutes = String(istDate.getMinutes()).padStart(2, "0");
  const seconds = String(istDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const customFormat = printf(({ level, message, stack }) => {
  const levelUpper = level.toUpperCase();
  const stackTrace = stack ? `\n${stack}` : "";
  return `[${getISTTimestamp()}] [${levelUpper}]: ${message}${stackTrace}`;
});

const consoleFormat = combine(errors({ stack: true }), customFormat, colorize({ all: true }));

interface CustomLogger extends Logger {
  success: (msg: string) => void;
}

const logger = createLogger({
  levels: customLevels.levels,
  level: "debug",
  transports: [
    new transports.Console({
      format: consoleFormat,
    }),
  ],
}) as CustomLogger;

logger.success = (msg: string) => logger.log({ level: "success", message: msg });

export default logger;
