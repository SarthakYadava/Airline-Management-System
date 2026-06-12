const { REMINDER_BINDING_KEY } = require('../config/ServerConfig');
const { publishMessage } = require('./messageQueue');

const publishBookingConfirmation = async (booking, recipientEmail) => {
    const payload = {
        service: 'CREATE_TICKET',
        data: {
            subject: `Booking ${booking.id} confirmed`,
            content: [
                `Your booking for flight ${booking.flightId} is confirmed.`,
                `Seats: ${booking.noOfSeats}.`,
                `Total: INR ${booking.totalCost}.`
            ].join(' '),
            recepientEmail: recipientEmail,
            notificationTime: new Date().toISOString()
        }
    };

    await publishMessage(
        REMINDER_BINDING_KEY,
        JSON.stringify(payload)
    );
};

module.exports = {
    publishBookingConfirmation
};
