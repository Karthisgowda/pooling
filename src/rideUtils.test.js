import { calculateRideStats, cleanText, getAvailableSeats, phoneHref, titleCase } from "./rideUtils";

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
});
