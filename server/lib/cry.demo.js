var crypto = require('crypto');

var key = "demo";
module.exports = {
    en: function(val) {
        var value=val.toString();
        var cipher = crypto.createCipher('aes-256-cbc', key);
        var text = value;
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    },
    de: function(value) {
        var decipher = crypto.createDecipher('aes-256-cbc', key);
        var dec = decipher.update(value, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }
}