const cron = require('node-cron');
const emailService = require('../services/email-service');
const { isEmailConfigured, sender } = require('../config/emailConfig');
const { EMAIL_JOB_SCHEDULE } = require('../config/serverConfig');

const deliverPendingEmails = async ({
    mailer = sender,
    service = emailService,
    logger = console
} = {}) => {
    if(!mailer) {
        return {
            delivered: 0,
            failed: 0,
            skipped: true
        };
    }

    const tickets = await service.fetchPendingEmails();
    let delivered = 0;
    let failed = 0;

    for(const ticket of tickets) {
        try {
            await mailer.sendMail({
                to: ticket.recepientEmail,
                subject: ticket.subject,
                text: ticket.content
            });
            await service.updateTicket(ticket.id, { status: 'SUCCESS' });
            delivered += 1;
        }
        catch (error) {
            await service.updateTicket(ticket.id, { status: 'FAILED' });
            logger.error(`Unable to send notification ticket ${ticket.id}`, error.message);
            failed += 1;
        }
    }

    return {
        delivered,
        failed,
        skipped: false
    };
};

const setupJobs = ({ logger = console } = {}) => {
    if(!isEmailConfigured) {
        logger.warn('Email scheduler disabled because EMAIL_ID and EMAIL_PASS are not configured');
        return null;
    }

    let isRunning = false;
    return cron.schedule(EMAIL_JOB_SCHEDULE, async () => {
        if(isRunning) {
            return;
        }

        isRunning = true;
        try {
            await deliverPendingEmails({ logger });
        }
        catch (error) {
            logger.error('Unable to process pending notification emails', error.message);
        }
        finally {
            isRunning = false;
        }
    });
};

module.exports = {
    deliverPendingEmails,
    setupJobs
};
