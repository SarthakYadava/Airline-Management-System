const express = require('express');

const { BookingController } = require('../../controllers/index');
const { BookingRequestValidator } = require('../../middlewares');
// const { createChannel } = require('../../utils/messageQueue');

// const channel = await createChannel();
const bookingController = new BookingController();

const router = express.Router();

router.get('/info', (req, res) =>{
    return res.json({message: "hitting the booking service through info"}); 
});
router.post(
    '/booking',
    BookingRequestValidator.validateAuthenticatedUser,
    BookingRequestValidator.validateCreateBooking,
    bookingController.create
);
router.get('/booking', BookingRequestValidator.validateAuthenticatedUser, bookingController.all);
router.post('/publish', bookingController.sendMessageToQueue);

module.exports = router;
