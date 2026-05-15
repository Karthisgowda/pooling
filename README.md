# Pooling

Pooling is a responsive cab sharing web app for listing rides, booking seats, and creating new shared cab trips. The app is built with React and stores demo ride data in the browser with `localStorage`, so it works on a static deployment without a separate backend.

## Features

- Browse available cab sharing rides.
- Search by source, destination, driver, or vehicle.
- View ride details, fare, seat availability, driver contact, and passengers.
- Book or cancel a seat in the selected ride.
- Create a new ride with driver, route, date, time, fare, vehicle, phone, and notes.
- Reset the demo data at any time.
- Responsive layout for desktop and mobile screens.

## Tech Stack

- React 17
- Create React App
- CSS modules through plain app styles
- Browser `localStorage` for demo persistence

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm start
```

Run tests:

```bash
npm test -- --watchAll=false
```

Build for production:

```bash
npm run build
```

## Deployment

This project is ready for static hosting on Vercel. The production build output is generated in the `build/` folder.

## Notes

The original project used a private local API address, which would not work after deployment. This version is self-contained so the live site remains usable immediately. A backend API can be connected later by replacing the local ride state with API calls.
