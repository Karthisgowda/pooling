import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import Trips from "./components/Trips";
import { SocketContext } from "./context/socketContext";
import { Navigate } from "react-router-dom";

function HomePage() {
  useEffect(() => {
    const check = () => {
      if (token === "") {
        navigate("/login");
      }
    };
    check();
  });
  const navigate = useNavigate();
  const { token } = useContext(SocketContext);

  return (
    <div className="mw-100">
      {token === "" && <Navigate to="/login" replace={true} />}
      <h1 className="mw-100 text-center">Home Page</h1>
      <Trips />
    </div>
  );
}

export default HomePage;
