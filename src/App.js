import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { ASSISTANT_PROMPTS, RIDE_STATUSES, SORT_OPTIONS } from "./rideConstants";
import { calculateRideStats, cleanText, createRideShareText, formatDate, getAvailableSeats, getOccupancyPercent, getPassengerCount, getRideTotalFare, hasMatchingRoute, isValidRide, phoneHref, titleCase } from "./rideUtils";

const STORAGE_KEY = "pooling-rides";

const emptyForm = {
  driver: "",
  source: "",
  destination: "",
  date: "",
  time: "",
  seats: "4",
  fare: "",
  vehicle: "",
  phone: "",
  notes: "",
};

function loadRides() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function App() {
  const today = new Date().toISOString().slice(0, 10);
  const [rides, setRides] = useState(loadRides);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [activeRideId, setActiveRideId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [assistantReply, setAssistantReply] = useState("");
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantError, setAssistantError] = useState("");
  const [passengerName, setPassengerName] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [notice, setNotice] = useState("");
  const activeRide = rides.find((ride) => ride.id === activeRideId) ?? rides[0] ?? null;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rides));
    setLastUpdated(new Date().toLocaleString("en-IN"));
  }, [rides]);

  const filteredRides = useMemo(() => {
    const search = query.trim().toLowerCase();

    const matchedRides = rides.filter((ride) => {
      const matchesStatus = statusFilter === "All" || (ride.status ?? "Open") === statusFilter;
      const matchesSearch = !search || [ride.source, ride.destination, ride.driver, ride.vehicle]
        .join(" ")
        .toLowerCase()
        .includes(search);
      return matchesStatus && matchesSearch;
    });

    return [...matchedRides].sort((left, right) => {
      if (sortBy === "fare") {
        return Number(left.fare) - Number(right.fare);
      }

      if (sortBy === "seats") {
        return getAvailableSeats(right) - getAvailableSeats(left);
      }

      return `${left.date}T${left.time}`.localeCompare(`${right.date}T${right.time}`);
    });
  }, [query, rides, sortBy, statusFilter]);

  const stats = useMemo(() => {
    return calculateRideStats(rides);
  }, [rides]);

  function updateForm(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function createRide(event) {
    event.preventDefault();
    const seats = Number(form.seats);
    const fare = Number(form.fare);

    if (form.date < today) {
      setFormError("Trip date cannot be in the past.");
      return;
    }

    if (!Number.isInteger(seats) || seats < 1 || seats > 8) {
      setFormError("Seats must be a whole number between 1 and 8.");
      return;
    }

    if (!Number.isFinite(fare) || fare < 1) {
      setFormError("Fare must be a positive amount.");
      return;
    }

    if (hasMatchingRoute(rides, form)) {
      setFormError("A ride with the same route, date, and time already exists.");
      return;
    }

    const nextRide = {
      ...form,
      id: `ride-${Date.now()}`,
      driver: titleCase(form.driver),
      source: titleCase(form.source),
      destination: titleCase(form.destination),
      vehicle: cleanText(form.vehicle),
      phone: cleanText(form.phone),
      notes: cleanText(form.notes),
      seats,
      bookedSeats: 0,
      fare,
      status: "Open",
      passengers: [],
    };

    setRides((current) => [nextRide, ...current]);
    setActiveRideId(nextRide.id);
    setForm(emptyForm);
    setFormError("");
  }

  function bookSeat(rideId) {
    setRides((current) =>
      current.map((ride) => {
        if (ride.id !== rideId || ride.status === "Completed" || ride.bookedSeats >= ride.seats) {
          return ride;
        }

        const bookedSeats = ride.bookedSeats + 1;

        return {
          ...ride,
          bookedSeats,
          status: bookedSeats >= ride.seats ? "Full" : "Open",
          passengers: [...ride.passengers, cleanText(passengerName) || "Passenger"],
        };
      }),
    );
    setPassengerName("");
    setNotice("Seat booked successfully.");
  }

  function cancelSeat(rideId) {
    setRides((current) =>
      current.map((ride) => {
        if (ride.id !== rideId || ride.status === "Completed" || ride.bookedSeats === 0) {
          return ride;
        }

        const bookedSeats = ride.bookedSeats - 1;

        return {
          ...ride,
          bookedSeats,
          status: "Open",
          passengers: ride.passengers.slice(0, -1),
        };
      }),
    );
    setNotice("Seat booking canceled.");
  }

  function completeRide(rideId) {
    setRides((current) =>
      current.map((ride) => {
        if (ride.id !== rideId) {
          return ride;
        }

        return {
          ...ride,
          status: "Completed",
        };
      }),
    );
    setNotice("Ride marked as completed.");
  }

  function deleteRide(rideId) {
    setRides((current) => current.filter((ride) => ride.id !== rideId));
    setActiveRideId("");
    setNotice("Ride deleted.");
  }

  async function copyRide(ride) {
    await navigator.clipboard.writeText(createRideShareText(ride));
    setNotice("Ride summary copied.");
  }

  function clearFilters() {
    setQuery("");
    setStatusFilter("All");
    setSortBy("date");
  }

  function exportRides() {
    const payload = JSON.stringify(rides, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pooling-rides.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function importRides(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);

        if (Array.isArray(imported) && imported.every(isValidRide)) {
          setRides(imported);
          setActiveRideId("");
          setFormError("");
          setNotice("Ride data imported.");
        } else {
          setFormError("Imported file does not contain valid rides.");
        }
      } catch {
        setFormError("Could not import rides. Please choose a valid JSON export.");
      }
    };
    reader.readAsText(file);
  }

  async function askAssistant(event) {
    event.preventDefault();
    const message = assistantQuestion.trim();

    if (message.length < 3) {
      setAssistantError("Please enter a clear question for the assistant.");
      return;
    }

    setAssistantLoading(true);
    setAssistantError("");

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, rides }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Assistant request failed.");
      }

      setAssistantReply(data.reply);
    } catch (error) {
      setAssistantError(error.message);
    } finally {
      setAssistantLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <nav className="topbar">
        <div>
          <p className="eyebrow">Cab pooling</p>
          <h1>Share routes, split fares, reach together.</h1>
        </div>
      </nav>

      <section className="hero-grid">
        <div className="hero-panel">
          <p className="eyebrow">Live ride board</p>
          <h2>Find trusted cab partners for everyday routes.</h2>
          <p>
            Pooling keeps ride planning simple: publish your trip, reserve open seats,
            and track who is travelling with you.
          </p>
          <p className="data-note">Ride data is saved privately in this browser.</p>
          {lastUpdated && <p className="updated-note">Last updated: {lastUpdated}</p>}
          {notice && <p className="notice" role="status">{notice}</p>}
          <div className="stats-row">
            <span><strong>{stats.rides}</strong> rides</span>
            <span><strong>{stats.openRides}</strong> open</span>
            <span><strong>{stats.availableSeats}</strong> seats open</span>
            <span><strong>{stats.completedRides}</strong> completed</span>
          </div>
        </div>
        <form className="search-panel" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="search">Search rides</label>
          <input
            id="search"
            type="search"
            placeholder="Source, destination, driver, vehicle"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <label htmlFor="status">Status</label>
          <select id="status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            {RIDE_STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <label htmlFor="sort">Sort by</label>
          <select id="sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button className="secondary-button" type="button" onClick={clearFilters}>
            Clear filters
          </button>
        </form>
      </section>

      <section className="layout">
        <div className="ride-list" aria-label="Available rides">
          {rides.length === 0 && (
            <div className="empty-state onboarding-state">
              <strong>No rides published yet.</strong>
              <span>Create the first cab share using the form below.</span>
            </div>
          )}
          {filteredRides.map((ride) => (
            <button
              className={`ride-card ${activeRide?.id === ride.id ? "active" : ""}`}
              key={ride.id}
              type="button"
              aria-label={`View ride from ${ride.source} to ${ride.destination}`}
              onClick={() => setActiveRideId(ride.id)}
            >
              <span className="route">{ride.source} to {ride.destination}</span>
              <span>Driver: {ride.driver}</span>
              <span>{formatDate(ride.date)} at {ride.time}</span>
              <span>{getPassengerCount(ride)} passengers listed</span>
              <span>{getAvailableSeats(ride)} seats open - Rs. {ride.fare}</span>
              <span className={`status-pill ${(ride.status ?? "Open").toLowerCase()}`}>{ride.status ?? "Open"}</span>
            </button>
          ))}
          {rides.length > 0 && filteredRides.length === 0 && <p className="empty-state">No rides match your search.</p>}
        </div>

        {activeRide ? (
          <article className="detail-panel">
            <div className="detail-header">
              <div>
                <p className="eyebrow">Selected ride</p>
                <h2>{activeRide.source} to {activeRide.destination}</h2>
              </div>
              <span className="fare">Rs. {activeRide.fare}</span>
            </div>
            <dl className="details">
              <div><dt>Driver</dt><dd>{activeRide.driver}</dd></div>
              <div><dt>Status</dt><dd>{activeRide.status ?? "Open"}</dd></div>
              <div><dt>Date</dt><dd>{formatDate(activeRide.date)}</dd></div>
              <div><dt>Time</dt><dd>{activeRide.time}</dd></div>
              <div><dt>Vehicle</dt><dd>{activeRide.vehicle}</dd></div>
              <div><dt>Contact</dt><dd><a href={phoneHref(activeRide.phone)}>{activeRide.phone}</a></dd></div>
              <div><dt>Seats</dt><dd>{activeRide.bookedSeats}/{activeRide.seats} booked</dd></div>
              <div><dt>Passengers</dt><dd>{getPassengerCount(activeRide)}</dd></div>
              <div><dt>Occupancy</dt><dd>{getOccupancyPercent(activeRide)}%</dd></div>
              <div><dt>Booked fare</dt><dd>Rs. {getRideTotalFare(activeRide)}</dd></div>
            </dl>
            <p className="notes">{activeRide.notes}</p>
            <div className="passenger-list">
              {(activeRide.passengers.length ? activeRide.passengers : ["No passengers yet"]).map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
            <div className="actions">
              <input
                className="passenger-input"
                type="text"
                placeholder="Passenger name"
                value={passengerName}
                onChange={(event) => setPassengerName(event.target.value)}
              />
              <button type="button" onClick={() => bookSeat(activeRide.id)} disabled={activeRide.status === "Completed" || activeRide.bookedSeats >= activeRide.seats}>
                Book seat
              </button>
              <button className="secondary-button" type="button" onClick={() => cancelSeat(activeRide.id)} disabled={activeRide.status === "Completed"}>
                Cancel one seat
              </button>
              <button className="secondary-button" type="button" onClick={() => completeRide(activeRide.id)} disabled={activeRide.status === "Completed"}>
                Mark completed
              </button>
              <button className="secondary-button" type="button" onClick={() => copyRide(activeRide)}>
                Copy ride
              </button>
              <button className="danger-button" type="button" onClick={() => deleteRide(activeRide.id)}>
                Delete ride
              </button>
            </div>
          </article>
        ) : (
          <article className="detail-panel empty-detail">
            <p className="eyebrow">Ride details</p>
            <h2>Publish a ride to begin.</h2>
            <p className="notes">
              New rides appear here with seat availability, passenger names, contact details, and booking actions.
            </p>
          </article>
        )}
      </section>

      <section className="create-section">
        <div>
          <p className="eyebrow">Create a trip</p>
          <h2>Add a cab share in under a minute.</h2>
        </div>
        <form className="ride-form" onSubmit={createRide}>
          {formError && <p className="form-error wide" role="alert">{formError}</p>}
          {[
            ["driver", "Driver name", "text", "Full name"],
            ["source", "Source", "text", "Pickup city or area"],
            ["destination", "Destination", "text", "Drop city or area"],
            ["date", "Date", "date"],
            ["time", "Time", "time"],
            ["seats", "Seats", "number", "1 to 8 seats"],
            ["fare", "Fare per seat", "number", "Amount in rupees"],
            ["vehicle", "Vehicle", "text", "Car model"],
            ["phone", "Phone", "tel", "Contact number"],
          ].map(([name, label, type, placeholder]) => (
            <label key={name}>
              {label}
              <input
                name={name}
                type={type}
                min={name === "date" ? today : name === "seats" || name === "fare" ? "1" : undefined}
                max={name === "seats" ? "8" : undefined}
                autoComplete={name === "driver" ? "name" : name === "phone" ? "tel" : undefined}
                placeholder={placeholder}
                value={form[name]}
                onChange={updateForm}
                required
              />
            </label>
          ))}
          <label className="wide">
            Notes
            <textarea name="notes" rows="3" value={form.notes} onChange={updateForm} required />
          </label>
          <button type="submit">Publish ride</button>
        </form>
      </section>

      <section className="assistant-section">
        <div>
          <p className="eyebrow">AI ride assistant</p>
          <h2>Ask about routes, seats, and ride planning.</h2>
        </div>
        <form className="assistant-form" onSubmit={askAssistant}>
          <input
            type="text"
            placeholder="Example: Which rides still have seats?"
            maxLength="240"
            value={assistantQuestion}
            onChange={(event) => setAssistantQuestion(event.target.value)}
            required
          />
          <button type="submit" disabled={assistantLoading || assistantQuestion.trim().length < 3}>
            {assistantLoading ? "Thinking..." : "Ask assistant"}
          </button>
        </form>
        <div className="prompt-row" aria-label="Assistant prompt presets">
          {ASSISTANT_PROMPTS.map((prompt) => (
            <button className="secondary-button compact-button" key={prompt} type="button" onClick={() => setAssistantQuestion(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
        {assistantError && <p className="form-error" role="alert">{assistantError}</p>}
        {assistantReply && (
          <div className="assistant-result">
            <p className="assistant-reply" aria-live="polite">{assistantReply}</p>
            <button className="secondary-button compact-button" type="button" onClick={() => setAssistantReply("")}>
              Clear answer
            </button>
          </div>
        )}
      </section>

      <footer className="footer">
        <span>Pooling cab sharing dashboard</span>
        <div className="footer-actions">
          <label className="import-button">
            Import rides
            <input type="file" accept="application/json" aria-label="Import rides JSON file" onChange={importRides} />
          </label>
          <button className="secondary-button compact-button" type="button" aria-label="Export rides JSON file" onClick={exportRides} disabled={rides.length === 0}>
            Export rides
          </button>
        </div>
      </footer>
    </main>
  );
}

export default App;
