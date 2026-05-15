import React, { useContext, useState } from "react";
import { SocketContext } from "../context/socketContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const { userId, token, setCreated } = useContext(SocketContext);
  const [source, setSource] = useState("");
  const [dest, setDest] = useState("");
  const [reason, setReason] = useState("");
  const [maxSeats, setSeats] = useState("");
  const [xdate, setXdate] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (
      source === "" ||
      dest === "" ||
      reason === "" ||
      maxSeats === "" ||
      xdate === ""
    ) {
      alert("Enter all fields!!");
    } else {
      await axios
        .post(
          "http://172.20.10.4:8000/api/v1/tours",
          {
            source,
            destination: dest,
            creatorId: userId,
            maxSeats,
            seatsLeft: maxSeats,
            description: reason,
            startDate: xdate,
          },
          {
            headers: { token },
          }
        )
        .then((res) => {
          setCreated(res.data.data.upUser.created);

          navigate("/createdtrips");
        })
        .catch((err) => {
          alert("Error in creating a trip, Try again!");
        });
    }
  };

  return (
    <div>
      <section className=" p-4" style={{ "background-color": "#eee" }}>
        <div className="container h-100 mb-5">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div
                className="card text-black"
                style={{ "border-radius": "25px" }}
              >
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                        Creat a Trip
                      </p>

                      <form
                        className="mx-1 mx-md-4"
                        onSubmit={(e) => e.preventDefault()}
                      >
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="text"
                              id="form3Example1c"
                              className="form-control"
                              onChange={(e) => setSource(e.target.value)}
                              value={source}
                            />
                            <label className="form-label" for="form3Example1c">
                              Source
                            </label>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="email"
                              id="form3Example3c"
                              className="form-control"
                              value={dest}
                              onChange={(e) => setDest(e.target.value)}
                            />
                            <label className="form-label" for="form3Example3c">
                              Destination
                            </label>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="number"
                              id="form3Example4c"
                              className="form-control"
                              value={maxSeats}
                              onChange={(e) => setSeats(e.target.value)}
                            />
                            <label className="form-label" for="form3Example4c">
                              Max Seats
                            </label>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="text"
                              id="form3Example4cd"
                              className="form-control"
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                            />
                            <label className="form-label" for="form3Example4cd">
                              Description
                            </label>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="date"
                              id="form3Example4ca"
                              className="form-control"
                              value={xdate}
                              onChange={(e) => setXdate(e.target.value)}
                            />
                            <label className="form-label" for="form3Example4cd">
                              Date
                            </label>
                          </div>
                        </div>

                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <button
                            type="button"
                            className="btn btn-primary btn-lg"
                            onClick={handleCreate}
                          >
                            Create
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                      <img
                        src="https://drawtodrive.com/uploads/8561/lmdrawing24-toyota-supra-mk4.jpeg"
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CreateTrip;
