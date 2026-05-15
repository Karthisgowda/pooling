import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TripDetail from "./components/TripDetail";
import { useContext } from "react";
import { SocketContext } from "./context/socketContext";
import Navbar from "./components/Navbar";
import UserDetails from "./components/UserDetails";
import CreateTrip from "./components/CreateTrip";
import Created from "./components/Created";
import "./App.css";
import Booked from "./components/Booked";
import TripStatus from "./components/TripStatus";
function App() {
  const { LoggedIn } = useContext(SocketContext);
  return (
    <div className="App">
      <Router>
        {LoggedIn && <Navbar />}
        <div className="mw-100 App">
          <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/" element={<Login />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/userdetails/:id" element={<UserDetails />}></Route>
            <Route path="/tripdetail/:id" element={<TripDetail />}></Route>
            <Route path="/schedule" element={<CreateTrip />}></Route>
            <Route path="/bookedtrips" element={<Booked />}></Route>
            <Route path="/createdtrips" element={<Created />}></Route>
            <Route path="/tripsStatus" element={<TripStatus />}></Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
