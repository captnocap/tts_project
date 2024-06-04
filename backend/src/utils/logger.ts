import fs from 'fs';
import path from 'path';

const logDirectory = path.join(__dirname, '../../logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const logFile = path.join(logDirectory, 'errors.log');

export const logError = (message: string) => {
  const logMessage = `${new Date().toISOString()} - ERROR: ${message}\n`;
  fs.appendFileSync(logFile, logMessage);
};
