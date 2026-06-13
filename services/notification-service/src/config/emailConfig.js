const nodemailer = require('nodemailer');

const { EMAIL_ID, EMAIL_PASS } = require('./serverConfig');

const isEmailConfigured = Boolean(EMAIL_ID && EMAIL_PASS);
const sender = isEmailConfigured
    ? nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: EMAIL_ID,
            pass: EMAIL_PASS
        }
    })
    : null;

module.exports = {
    isEmailConfigured,
    sender
};
