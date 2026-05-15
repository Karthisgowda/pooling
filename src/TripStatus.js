import { React, useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/socketContext";
import axios from "axios";
function TripStatus() {
  const navigate = useNavigate();
  const { token, userId } = useContext(SocketContext);
  const [tripStat, setStatus] = useState([]);
  useEffect(() => {
    const check = () => {
      if (token === "") {
        navigate("/login");
      }
    };
    check();
    const fetch = async () => {
      await axios
        .get(`http://172.20.10.4:8000/api/v1/coPass/status/${userId}`, {
          headers: {
            token: token,
          },
        })
        .then((res) => {
          setStatus(res.data.data.coPass.reverse());
        })
        .catch((err) => {});
    };

    fetch();
  }, []);

  return (
    <div>
      <table className="table table-striped" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Number</th>
            <th>source</th>
            <th>destination</th>
            <th>id</th>
            <th>date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tripStat.map((ele, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{ele.source}</td>
              <td>{ele.destination}</td>
              <td>{ele.tripId}</td>
              <td>{Date().split("T")[0]}</td>
              {ele.status === "Completed" && (
                <td>
                  <span class="badge bg-success">{ele.status}</span>
                </td>
              )}
              {ele.status === "Cancelled" && (
                <td>
                  <span class="badge bg-danger">{ele.status}</span>
                </td>
              )}
              {ele.status === "Scheduled" && (
                <td>
                  <span class="badge bg-primary">{ele.status}</span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TripStatus;
