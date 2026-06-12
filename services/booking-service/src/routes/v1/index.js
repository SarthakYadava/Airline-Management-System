const express = require('express');

const { BookingController } = require('../../controllers/index');
const { BookingRequestValidator } = require('../../middlewares');

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

module.exports = router;
