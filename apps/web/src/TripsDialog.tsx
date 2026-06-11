import { useEffect, useState } from 'react';

import { getBookings } from './api';
import type { Booking } from './types';

type TripsDialogProps = {
  token: string;
  onClose: () => void;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);

function TripsDialog({ token, onClose }: TripsDialogProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getBookings(token)
      .then(setBookings)
      .catch(() => setError('Your trips could not be loaded right now.'))
      .finally(() => setIsLoading(false));
  }, [token]);

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="dialog trips-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="trips-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="dialog-close" type="button" onClick={onClose} aria-label="Close">×</button>
        <span className="section-kicker">Your journeys</span>
        <h2 id="trips-title">My trips</h2>
        {isLoading && <div className="trips-loading">Loading your bookings…</div>}
        {error && <div className="dialog-error">{error}</div>}
        {!isLoading && !error && bookings.length === 0 && (
          <div className="trips-empty">
            <strong>No journeys booked yet.</strong>
            <p>Your confirmed flights will appear here.</p>
          </div>
        )}
        <div className="trip-list">
          {bookings.map((booking) => (
            <article className="trip-item" key={booking.id}>
              <div>
                <span>Booking #{booking.id}</span>
                <strong>Flight #{booking.flightId}</strong>
                <small>
                  {new Intl.DateTimeFormat('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }).format(new Date(booking.createdAt))}
                </small>
              </div>
              <div>
                <span>{booking.noOfSeats} traveler{booking.noOfSeats > 1 ? 's' : ''}</span>
                <strong>{formatCurrency(booking.totalCost)}</strong>
                <em className={`trip-status status-${booking.status.toLowerCase()}`}>
                  {booking.status}
                </em>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default TripsDialog;

