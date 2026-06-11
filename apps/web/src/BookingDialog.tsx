import { useState } from 'react';

import { createBooking } from './api';
import type { Flight } from './types';

type BookingDialogProps = {
  flight: Flight;
  passengers: number;
  token: string;
  onClose: () => void;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);

function BookingDialog({ flight, passengers, token, onClose }: BookingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const confirmBooking = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const payload = await createBooking(token, flight.id, passengers);
      setBookingId(payload.data.id);
    } catch {
      setError('The booking could not be completed. Please try another flight.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="dialog booking-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="dialog-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
        {bookingId ? (
          <div className="booking-success">
            <span className="success-mark">✓</span>
            <span className="section-kicker">Booking confirmed</span>
            <h2 id="booking-title">You are ready to fly.</h2>
            <p>
              Booking #{bookingId} has been confirmed for {passengers} traveler
              {passengers > 1 ? 's' : ''}.
            </p>
            <button className="dialog-primary" type="button" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <span className="section-kicker">Review your flight</span>
            <h2 id="booking-title">
              {flight.departureAirport.code} to {flight.arrivalAirport.code}
            </h2>
            <div className="booking-route">
              <div>
                <strong>{flight.departureAirport.City?.name}</strong>
                <span>{flight.departureAirport.name}</span>
              </div>
              <i>→</i>
              <div>
                <strong>{flight.arrivalAirport.City?.name}</strong>
                <span>{flight.arrivalAirport.name}</span>
              </div>
            </div>
            <div className="booking-summary">
              <div><span>Flight</span><strong>{flight.flightNumber}</strong></div>
              <div><span>Travelers</span><strong>{passengers}</strong></div>
              <div><span>Fare per traveler</span><strong>{formatCurrency(flight.price)}</strong></div>
              <div className="booking-total">
                <span>Total fare</span>
                <strong>{formatCurrency(flight.price * passengers)}</strong>
              </div>
            </div>
            {error && <div className="dialog-error">{error}</div>}
            <button
              className="dialog-primary"
              type="button"
              disabled={isSubmitting}
              onClick={confirmBooking}
            >
              {isSubmitting ? 'Confirming…' : 'Confirm booking'}
            </button>
          </>
        )}
      </section>
    </div>
  );
}

export default BookingDialog;

