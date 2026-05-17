import { calculateRideStats, cleanText, createExportFileName, createRideShareText, getAvailableSeats, getOccupancyPercent, getPassengerCount, getRideTotalFare, getRouteLabel, hasMatchingRoute, isValidRide, phoneHref, titleCase } from "./rideUtils";

test("normalizes ride text", () => {
  expect(cleanText("  mysuru   road  ")).toBe("mysuru road");
  expect(titleCase("mysuru road")).toBe("Mysuru Road");
});

test("calculates ride availability and stats", () => {
  const rides = [
    { seats: 4, bookedSeats: 1, status: "Open" },
    { seats: 2, bookedSeats: 2, status: "Completed" },
  ];

  expect(getAvailableSeats(rides[0])).toBe(3);
  expect(getOccupancyPercent(rides[0])).toBe(25);
  expect(getPassengerCount({ passengers: ["Asha", "Ravi"] })).toBe(2);
  expect(getRideTotalFare({ bookedSeats: 3, fare: 120 })).toBe(360);
  expect(calculateRideStats(rides)).toEqual({
    rides: 2,
    openRides: 1,
    completedRides: 1,
    availableSeats: 3,
    bookedSeats: 3,
  });
});

test("creates clean phone links", () => {
  expect(phoneHref("+91 98765 43210")).toBe("tel:+919876543210");
  expect(createExportFileName(new Date("2026-05-17T00:00:00.000Z"))).toBe("pooling-rides-2026-05-17.json");
});

test("creates shareable ride text", () => {
  const ride = {
    source: "Mysuru",
    destination: "Bengaluru",
    date: "2026-05-20",
    time: "09:00",
    seats: 4,
    bookedSeats: 1,
    fare: 250,
  };

  expect(createRideShareText(ride)).toContain("3 seats open");
  expect(getRouteLabel(ride)).toBe("Mysuru -> Bengaluru");
});

test("validates imported ride records", () => {
  expect(isValidRide({
    id: "ride-1",
    driver: "Driver",
    source: "A",
    destination: "B",
    date: "2026-05-20",
    time: "09:00",
    seats: 4,
    bookedSeats: 1,
    fare: 200,
  })).toBe(true);
  expect(isValidRide({ source: "A" })).toBe(false);
});

test("detects duplicate route timing", () => {
  expect(hasMatchingRoute([
    { source: "Mysuru", destination: "Bengaluru", date: "2026-05-20", time: "09:00" },
  ], {
    source: "mysuru",
    destination: "bengaluru",
    date: "2026-05-20",
    time: "09:00",
  })).toBe(true);
});
