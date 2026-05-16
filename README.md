# Pooling

Pooling is a responsive cab sharing web app for listing rides, booking seats, and creating new shared cab trips. The app is built with React and stores user-created ride data in the browser with `localStorage`, so it works on a static deployment without a separate database.

## Features

- Browse available cab sharing rides.
- Search by source, destination, driver, or vehicle.
- Filter rides by Open, Full, or Completed status.
- Sort rides by earliest trip, lowest fare, or most open seats.
- Clear all active filters with one action.
- View ride details, fare, seat availability, driver contact, and passengers.
- Book or cancel a seat in the selected ride.
- Mark rides completed or delete old rides.
- Create a new ride with driver, route, date, time, fare, vehicle, phone, and notes.
- Export locally saved rides as JSON.
- Ask the Groq-powered assistant questions about current ride availability.
- Responsive layout for desktop and mobile screens.

## Tech Stack

- React 17
- Create React App
- CSS modules through plain app styles
- Browser `localStorage` for user-created ride persistence

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

Set the server-side Groq key before using the assistant:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

## AI Assistant

The assistant sends the current ride list to a Vercel serverless function and asks Groq for a concise planning response. The frontend never receives the Groq API key. Only route, timing, seat, fare, vehicle, and status fields are included in the assistant context.

## Notes

The original project used a private local API address, which would not work after deployment. This version is self-contained for ride management and uses a Vercel serverless function for the Groq assistant so the API key is not exposed in frontend code.
