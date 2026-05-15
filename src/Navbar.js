import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { SocketContext } from "../context/socketContext";
import "./../App.css";
function Naavbar() {
  const { userId } = useContext(SocketContext);
  return (
    <div className="App" sytle={{}}>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark">
        <Link to="/home">
          <h2 className="navbar-brand" style={{ color: "white" }}>
            CarPOOLING
          </h2>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item ml-3">
              <Link to="/home">
                <p>Home</p>
              </Link>
            </li>
            <li className="nav-item ml-3">
              <Link to="/schedule">
                <p>Create</p>
              </Link>
            </li>
            <li className="nav-item ml-3">
              <Link to="/bookedtrips">
                <p>Booked</p>
              </Link>
            </li>
            <li className="nav-item ml-3">
              <Link to="/createdtrips">
                <p>Created</p>
              </Link>
            </li>
            <li className="nav-item ml-3">
              <Link to={`/userdetails/${userId}`}>
                <p>MyDetails</p>
              </Link>
            </li>
            <li className="nav-item ml-3">
              <Link to={`tripsStatus`}>
                <p>Trips-Status</p>
              </Link>
            </li>
            <li className="nav-item ml-3">
              <a href="/login" className="text-danger">
                <p>logout</p>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Naavbar;
