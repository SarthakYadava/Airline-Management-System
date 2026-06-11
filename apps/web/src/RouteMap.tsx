import type { Airport } from './types';

type RouteMapProps = {
  departure: Airport;
  arrival: Airport;
};

const project = (airport: Airport) => ({
  x: ((airport.longitude + 180) / 360) * 760,
  y: ((90 - airport.latitude) / 180) * 320
});

function RouteMap({ departure, arrival }: RouteMapProps) {
  const start = project(departure);
  const end = project(arrival);
  const controlX = (start.x + end.x) / 2;
  const controlY = Math.min(start.y, end.y) - 62;
  const route = `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`;

  return (
    <div className="route-map" aria-label={`${departure.code} to ${arrival.code} route map`}>
      <div className="map-heading">
        <div>
          <span className="section-kicker">Route overview</span>
          <strong>{departure.City?.name} to {arrival.City?.name}</strong>
        </div>
        <span className="map-badge">Direct route</span>
      </div>
      <svg viewBox="0 0 760 320" role="img">
        <defs>
          <linearGradient id="routeGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#aa2f3c" />
            <stop offset="100%" stopColor="#e1a85b" />
          </linearGradient>
          <pattern id="mapDots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#d8dde4" />
          </pattern>
        </defs>
        <rect width="760" height="320" fill="url(#mapDots)" />
        <path className="continent continent-one" d="M70 105 C120 52 185 65 220 100 C245 126 228 160 180 165 C135 170 105 150 70 105Z" />
        <path className="continent continent-two" d="M270 70 C350 36 438 55 470 98 C500 136 470 158 420 160 C370 164 350 205 305 192 C260 179 238 114 270 70Z" />
        <path className="continent continent-three" d="M505 185 C565 145 650 155 700 205 C675 252 615 270 548 250 C512 238 488 215 505 185Z" />
        <path className="route-line-shadow" d={route} />
        <path className="route-line" d={route} />
        <circle className="map-point-ring" cx={start.x} cy={start.y} r="10" />
        <circle className="map-point" cx={start.x} cy={start.y} r="5" />
        <circle className="map-point-ring" cx={end.x} cy={end.y} r="10" />
        <circle className="map-point" cx={end.x} cy={end.y} r="5" />
        <g className="map-plane" transform={`translate(${controlX - 11} ${controlY - 8}) rotate(-8)`}>
          <path d="M2 9 21 1l-4 7 5 3-2 3-6-2-5 8-3-1 2-9-6 2Z" />
        </g>
      </svg>
      <div className="map-label map-label-start">
        <strong>{departure.code}</strong>
        <span>{departure.City?.name}</span>
      </div>
      <div className="map-label map-label-end">
        <strong>{arrival.code}</strong>
        <span>{arrival.City?.name}</span>
      </div>
    </div>
  );
}

export default RouteMap;

