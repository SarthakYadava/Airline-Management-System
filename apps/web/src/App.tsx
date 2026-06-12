import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';

import { getAirports, searchFlights } from './api';
import AdminDashboard from './AdminDashboard';
import AuthDialog from './AuthDialog';
import BookingDialog from './BookingDialog';
import TripsDialog from './TripsDialog';
import { createDemoFlights, demoAirports } from './data';
import RouteMap from './RouteMap';
import type { Airport, Flight, SearchValues, Session } from './types';

import heroAircraft from './assets/travel/hero-aircraft.webp';
import dubaiImage from './assets/travel/destination-dubai.webp';
import parisImage from './assets/travel/destination-paris.webp';
import singaporeImage from './assets/travel/destination-singapore.webp';
import loungeImage from './assets/travel/lounge-story.webp';
import islandImage from './assets/travel/island-banner.webp';
import cabinCrewImage from './assets/travel/cabin-crew.webp';

const formatDateInput = (date: Date) => date.toISOString().slice(0, 10);

const formatTime = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  }).format(new Date(value));

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC'
  }).format(new Date(value));

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);

const getDuration = (departure: string, arrival: string) => {
  const minutes = Math.round(
    (new Date(arrival).getTime() - new Date(departure).getTime()) / 60000
  );
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
};

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const readStoredSession = () => {
  try {
    const stored = localStorage.getItem('skyroute-session');
    if (!stored) return null;
    const session = JSON.parse(stored) as Partial<Session>;
    if (!session.token || !session.userId || !session.email) return null;
    return {
      token: session.token,
      userId: session.userId,
      email: session.email,
      roles: session.roles || [],
      isAdmin: Boolean(session.isAdmin)
    } satisfies Session;
  } catch {
    localStorage.removeItem('skyroute-session');
    return null;
  }
};

function App() {
  const [airports, setAirports] = useState<Airport[]>(demoAirports);
  const [isPreviewData, setIsPreviewData] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [sort, setSort] = useState<'recommended' | 'price' | 'departure'>('recommended');
  const [showAuth, setShowAuth] = useState(false);
  const [showTrips, setShowTrips] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [openTripsAfterAuth, setOpenTripsAfterAuth] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [pendingFlight, setPendingFlight] = useState<Flight | null>(null);
  const [session, setSession] = useState<Session | null>(readStoredSession);
  const [search, setSearch] = useState<SearchValues>({
    departureAirportId: demoAirports[0].id,
    arrivalAirportId: demoAirports[1].id,
    departureDate: formatDateInput(tomorrow),
    passengers: 1
  });
  const [flights, setFlights] = useState<Flight[]>(() =>
    createDemoFlights(formatDateInput(tomorrow))
  );

  useEffect(() => {
    getAirports()
      .then((data) => {
        const mapped = data.filter((airport) => airport.code);
        if (mapped.length >= 2) {
          setAirports(mapped);
          setSearch((current) => ({
            ...current,
            departureAirportId: mapped[0].id,
            arrivalAirportId: mapped[1].id
          }));
          setIsPreviewData(false);
        }
      })
      .catch(() => setIsPreviewData(true));
  }, []);

  const departure = airports.find((airport) => airport.id === search.departureAirportId)
    || airports[0];
  const arrival = airports.find((airport) => airport.id === search.arrivalAirportId)
    || airports[1];

  const sortedFlights = useMemo(() => {
    const next = [...flights];
    if (sort === 'price') next.sort((a, b) => a.price - b.price);
    if (sort === 'departure') {
      next.sort(
        (a, b) =>
          new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
      );
    }
    return next;
  }, [flights, sort]);

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    setHasSearched(true);
    setIsSearching(true);

    try {
      const results = await searchFlights(search);
      setFlights(results);
      setIsPreviewData(false);
    } catch {
      setFlights(createDemoFlights(search.departureDate, departure, arrival));
      setIsPreviewData(true);
    } finally {
      setIsSearching(false);
      window.setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }
  };

  const swapAirports = () => {
    setSearch((current) => ({
      ...current,
      departureAirportId: current.arrivalAirportId,
      arrivalAirportId: current.departureAirportId
    }));
  };

  const chooseFlight = (flight: Flight) => {
    if (!session) {
      setPendingFlight(flight);
      setShowAuth(true);
      return;
    }
    setSelectedFlight(flight);
  };

  const handleAuthenticated = (nextSession: Session) => {
    localStorage.setItem('skyroute-session', JSON.stringify(nextSession));
    setSession(nextSession);
    setShowAuth(false);
    if (pendingFlight) {
      setSelectedFlight(pendingFlight);
      setPendingFlight(null);
    }
    if (openTripsAfterAuth) {
      setShowTrips(true);
      setOpenTripsAfterAuth(false);
    }
  };

  const handleAccount = () => {
    if (!session) {
      setShowAuth(true);
      return;
    }
    localStorage.removeItem('skyroute-session');
    setSession(null);
    setShowAdmin(false);
  };

  const handleTrips = () => {
    setIsMenuOpen(false);
    if (!session) {
      setOpenTripsAfterAuth(true);
      setShowAuth(true);
      return;
    }
    setShowTrips(true);
  };

  if (session?.isAdmin && showAdmin) {
    return <AdminDashboard session={session} onClose={() => setShowAdmin(false)} />;
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="SkyRoute home">
          <span className="brand-mark">S</span>
          <span>
            <strong>SkyRoute</strong>
            <small>Journeys, elevated</small>
          </span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-controls="primary-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <nav
          id="primary-navigation"
          className={isMenuOpen ? 'nav-links nav-links-open' : 'nav-links'}
        >
          <a href="#search" onClick={() => setIsMenuOpen(false)}>Book</a>
          <a href="#destinations" onClick={() => setIsMenuOpen(false)}>Destinations</a>
          <a href="#experience" onClick={() => setIsMenuOpen(false)}>Experience</a>
          <button type="button" onClick={handleTrips}>My trips</button>
          {session?.isAdmin && (
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                setShowAdmin(true);
              }}
            >
              Manage
            </button>
          )}
        </nav>
        <button className="account-button" type="button" onClick={handleAccount}>
          <span className="account-icon">◎</span>
          {session ? 'Sign out' : 'Sign in'}
        </button>
      </header>

      <main id="top">
        <section className="hero" style={{ backgroundImage: `url(${heroAircraft})` }}>
          <div className="hero-shade" />
          <div className="hero-copy">
            <span className="overline">Travel beyond the ordinary</span>
            <h1>The world feels closer from up here.</h1>
            <p>
              Thoughtful journeys, remarkable places, and a clearer way to find
              your next flight.
            </p>
          </div>
          <div className="hero-scroll">
            <span />
            Explore
          </div>
        </section>

        <section className="search-wrap" id="search">
          <form className="search-card" onSubmit={handleSearch}>
            <div className="search-card-top">
              <div className="trip-tabs" aria-label="Trip type">
                <button
                  className="trip-tab"
                  type="button"
                  disabled
                  title="Round-trip booking is not yet available"
                >
                  Round trip
                </button>
                <button
                  className="trip-tab trip-tab-active"
                  type="button"
                  aria-pressed="true"
                >
                  One way
                </button>
              </div>
              <span className="cabin-label">Economy class</span>
            </div>
            <div className="search-grid">
              <label className="search-field airport-field">
                <span>From</span>
                <select
                  value={search.departureAirportId}
                  onChange={(event) =>
                    setSearch((current) => ({
                      ...current,
                      departureAirportId: Number(event.target.value)
                    }))
                  }
                >
                  {airports.map((airport) => (
                    <option key={airport.id} value={airport.id}>
                      {airport.code} · {airport.City?.name || airport.name}
                    </option>
                  ))}
                </select>
                <small>{departure.name}</small>
              </label>
              <button className="swap-button" type="button" onClick={swapAirports} aria-label="Swap airports">
                ⇄
              </button>
              <label className="search-field airport-field">
                <span>To</span>
                <select
                  value={search.arrivalAirportId}
                  onChange={(event) =>
                    setSearch((current) => ({
                      ...current,
                      arrivalAirportId: Number(event.target.value)
                    }))
                  }
                >
                  {airports.map((airport) => (
                    <option key={airport.id} value={airport.id}>
                      {airport.code} · {airport.City?.name || airport.name}
                    </option>
                  ))}
                </select>
                <small>{arrival.name}</small>
              </label>
              <label className="search-field compact-field departure-field">
                <span>Departure</span>
                <input
                  type="date"
                  min={formatDateInput(new Date())}
                  value={search.departureDate}
                  onChange={(event) =>
                    setSearch((current) => ({
                      ...current,
                      departureDate: event.target.value
                    }))
                  }
                />
              </label>
              <label className="search-field compact-field traveler-field">
                <span>Travelers</span>
                <select
                  value={search.passengers}
                  onChange={(event) =>
                    setSearch((current) => ({
                      ...current,
                      passengers: Number(event.target.value)
                    }))
                  }
                >
                  {[1, 2, 3, 4, 5, 6].map((count) => (
                    <option key={count} value={count}>
                      {count} {count === 1 ? 'passenger' : 'passengers'}
                    </option>
                  ))}
                </select>
              </label>
              <button className="search-button" type="submit" disabled={isSearching}>
                {isSearching ? 'Searching…' : 'Search flights'}
                <span>↗</span>
              </button>
            </div>
          </form>
        </section>

        <section className="results-section" id="results">
          <div className="results-intro">
            <div>
              <span className="section-kicker">{hasSearched ? 'Search results' : 'Popular today'}</span>
              <h2>{departure.City?.name} to {arrival.City?.name}</h2>
              <p>
                {formatDate(search.departureDate)} · {search.passengers} traveler
                {search.passengers > 1 ? 's' : ''} · Economy
              </p>
            </div>
            <div className="results-controls">
              {isPreviewData && <span className="preview-badge">Preview data</span>}
              <label>
                <span>Sort by</span>
                <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
                  <option value="recommended">Recommended</option>
                  <option value="price">Lowest price</option>
                  <option value="departure">Departure time</option>
                </select>
              </label>
            </div>
          </div>

          <div className="results-layout">
            <div className="flight-list">
              {sortedFlights.length ? sortedFlights.map((flight, index) => (
                <article className="flight-card" key={flight.id}>
                  <div className="flight-brand">
                    <span className="mini-mark">S</span>
                    <div>
                      <strong>SkyRoute</strong>
                      <small>{flight.flightNumber} · {flight.airplane?.modelNumber || 'Aircraft'}</small>
                    </div>
                  </div>
                  <div className="flight-times">
                    <div>
                      <strong>{formatTime(flight.departureTime)}</strong>
                      <span>{flight.departureAirport?.code || departure.code}</span>
                    </div>
                    <div className="flight-path">
                      <span>{getDuration(flight.departureTime, flight.arrivalTime)}</span>
                      <div><i /></div>
                      <small>Nonstop</small>
                    </div>
                    <div>
                      <strong>{formatTime(flight.arrivalTime)}</strong>
                      <span>{flight.arrivalAirport?.code || arrival.code}</span>
                    </div>
                  </div>
                  <div className="flight-meta">
                    <span>{flight.totalSeats} seats left</span>
                    <small>Gate {flight.boardingGate || 'TBA'}</small>
                  </div>
                  <div className="flight-price">
                    {index === 0 && <span>Best value</span>}
                    <small>From</small>
                    <strong>{formatCurrency(flight.price)}</strong>
                    <em>per traveler</em>
                    <button type="button" onClick={() => chooseFlight(flight)}>Select</button>
                  </div>
                </article>
              )) : (
                <div className="empty-state">
                  <strong>No flights found for this route.</strong>
                  <p>Try another date or airport pair.</p>
                </div>
              )}
            </div>
            <RouteMap departure={departure} arrival={arrival} />
          </div>
        </section>

        <section className="destinations-section" id="destinations">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Curated journeys</span>
              <h2>Places worth crossing the world for.</h2>
            </div>
            <p>Discover cities selected for remarkable culture, design, and unforgettable stays.</p>
          </div>
          <div className="destination-grid">
            {[
              { city: 'Dubai', detail: 'Modern wonder, desert soul', image: dubaiImage, code: 'DXB' },
              { city: 'Paris', detail: 'Art, light, and timeless streets', image: parisImage, code: 'CDG' },
              { city: 'Singapore', detail: 'A garden city after dark', image: singaporeImage, code: 'SIN' }
            ].map((destination) => (
              <article className="destination-card" key={destination.city}>
                <img src={destination.image} alt={`${destination.city} destination`} loading="lazy" />
                <div className="destination-overlay" />
                <span className="destination-code">{destination.code}</span>
                <div>
                  <h3>{destination.city}</h3>
                  <p>{destination.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="experience-section" id="experience">
          <div className="experience-image">
            <img src={cabinCrewImage} alt="SkyRoute cabin crew welcoming passengers" loading="lazy" />
          </div>
          <div className="experience-copy">
            <span className="section-kicker">The SkyRoute experience</span>
            <h2>Service that feels considered, never rehearsed.</h2>
            <p>
              From a calm welcome to thoughtful details throughout the journey,
              every interaction is designed around genuine comfort.
            </p>
            <div className="experience-points">
              <div><strong>01</strong><span>Warm, attentive hospitality</span></div>
              <div><strong>02</strong><span>Clear support at every step</span></div>
              <div><strong>03</strong><span>A journey designed around you</span></div>
            </div>
          </div>
        </section>

        <section className="lounge-section">
          <img src={loungeImage} alt="Premium airport lounge overlooking the runway" loading="lazy" />
          <div className="lounge-copy">
            <span className="section-kicker light-kicker">Before you fly</span>
            <h2>Make the airport part of the journey.</h2>
            <p>Quiet spaces, considered design, and time to settle in before departure.</p>
          </div>
        </section>

        <section className="island-banner" style={{ backgroundImage: `url(${islandImage})` }}>
          <div className="island-content">
            <span className="section-kicker light-kicker">Seasonal escapes</span>
            <h2>Leave the familiar far behind.</h2>
            <p>Explore island routes and warm-weather journeys selected for the months ahead.</p>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <span className="brand-mark">S</span>
          <div><strong>SkyRoute</strong><small>Airline platform</small></div>
        </div>
        <div className="footer-links">
          <a href="#search">Book a flight</a>
          <a href="#destinations">Destinations</a>
          <a href="#experience">Travel experience</a>
          <a href="#top">Back to top</a>
        </div>
        <p>Built as a full-stack airline services learning project.</p>
      </footer>
      {showAuth && (
        <AuthDialog
          onClose={() => {
            setShowAuth(false);
            setPendingFlight(null);
            setOpenTripsAfterAuth(false);
          }}
          onAuthenticated={handleAuthenticated}
        />
      )}
      {selectedFlight && session && (
        <BookingDialog
          flight={selectedFlight}
          passengers={search.passengers}
          token={session.token}
          onClose={() => setSelectedFlight(null)}
        />
      )}
      {showTrips && session && (
        <TripsDialog token={session.token} onClose={() => setShowTrips(false)} />
      )}
    </div>
  );
}

export default App;
