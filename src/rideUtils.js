export function cleanText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function titleCase(value) {
  return cleanText(value).replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function phoneHref(phone) {
  return `tel:${String(phone).replace(/[^\d+]/g, "")}`;
}

export function getAvailableSeats(ride) {
  return Number(ride.seats) - Number(ride.bookedSeats);
}

export function getOccupancyPercent(ride) {
  const seats = Number(ride.seats);

  if (!seats) {
    return 0;
  }

  return Math.round((Number(ride.bookedSeats) / seats) * 100);
}

export function getRideTotalFare(ride) {
  return Number(ride.bookedSeats) * Number(ride.fare);
}

export function getPassengerCount(ride) {
  return Array.isArray(ride.passengers) ? ride.passengers.length : 0;
}

export function createRideShareText(ride) {
  return `${ride.source} to ${ride.destination} on ${ride.date} at ${ride.time}. ${getAvailableSeats(ride)} seats open at Rs. ${ride.fare} per seat.`;
}

export function getRouteLabel(ride) {
  return `${ride.source} -> ${ride.destination}`;
}

export function createExportFileName(date = new Date()) {
  return `pooling-rides-${date.toISOString().slice(0, 10)}.json`;
}

export function hasMatchingRoute(rides, form) {
  const source = titleCase(form.source);
  const destination = titleCase(form.destination);

  return rides.some((ride) => {
    return ride.source === source && ride.destination === destination && ride.date === form.date && ride.time === form.time;
  });
}

export function calculateRideStats(rides) {
  const totalSeats = rides.reduce((sum, ride) => sum + Number(ride.seats), 0);
  const bookedSeats = rides.reduce((sum, ride) => sum + Number(ride.bookedSeats), 0);

  return {
    rides: rides.length,
    openRides: rides.filter((ride) => (ride.status ?? "Open") === "Open").length,
    completedRides: rides.filter((ride) => ride.status === "Completed").length,
    availableSeats: totalSeats - bookedSeats,
    bookedSeats,
  };
}

export function isValidRide(ride) {
  return Boolean(
    ride &&
      ride.id &&
      ride.driver &&
      ride.source &&
      ride.destination &&
      ride.date &&
      ride.time &&
      Number.isFinite(Number(ride.seats)) &&
      Number.isFinite(Number(ride.bookedSeats)) &&
      Number.isFinite(Number(ride.fare)),
  );
}
