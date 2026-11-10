'use strict';

// Copy this file to cry.js. Keep the random 32-byte key outside source control.
// Rotating the key (or switching from the old cipher) invalidates existing sessions.
var crypto = require('crypto');
var encodedKey = process.env.CMS_COOKIE_KEY;
var key = Buffer.from(encodedKey || '', 'base64');
if (!encodedKey || key.length !== 32 || key.toString('base64') !== encodedKey) {
    throw new Error('CMS_COOKIE_KEY must be a base64-encoded random 32-byte key');
}

module.exports = {
    en: function(value) {
        var iv = crypto.randomBytes(12);
        var cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        var encrypted = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
        return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
    },
    de: function(value) {
        // Malformed or tampered cookies are unauthenticated, not server errors.
        if (typeof value !== 'string' || value.length > 8192 || !/^[A-Za-z0-9_-]+$/.test(value)) return '';
        try {
            var data = Buffer.from(value, 'base64url');
            if (data.length < 28) return '';
            var decipher = crypto.createDecipheriv('aes-256-gcm', key, data.subarray(0, 12));
            decipher.setAuthTag(data.subarray(12, 28));
            return Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]).toString('utf8');
        } catch (error) {
            return '';
        }
    }
};
