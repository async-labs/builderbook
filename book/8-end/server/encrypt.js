// from https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb

const crypto = require('crypto');
const logger = require('./logger');

require('dotenv').config();

const { ENCRYPTION_KEY } = process.env; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;

if (require.main === module) {
  const textToEncrypt = process.argv[2];
  if (textToEncrypt) {
    const encrypted = encrypt(textToEncrypt);

    logger.debug('text to encrypt:', textToEncrypt);
    logger.debug('encryption:', encrypted);
    logger.debug('decryption:', decrypt(encrypted));
  }
}
