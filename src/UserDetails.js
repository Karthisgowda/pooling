import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { SocketContext } from "../context/socketContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserDetails() {
  const navigate = useNavigate();
  const [organizer, setOrganizer] = useState({});
  const { token, userId } = useContext(SocketContext);
  const para = useParams();
  useEffect(() => {
    const check = () => {
      if (token === "") {
        navigate("/login");
      }
    };
    check();
  });
  useEffect(() => {
    const fetchUser = async () => {
      await axios
        .get(`http://172.20.10.4:8000/api/v1/users/${para.id}`, {
          headers: {
            token: token,
          },
        })
        .then((res) => {
          console.log(res.data.data.person);
          setOrganizer(res.data.data.person);
        })
        .catch((err) => {});
    };
    fetchUser();
  }, [token, para.id]);

  const changePhone = async () => {
    let phone = window.prompt("Enter the phone number:");
    if (phone != null) {
      if (phone.length !== 10) {
        alert("Enter a propper number!");
      } else {
        await axios
          .patch(
            `http://172.20.10.4:8000/api/v1/users/${userId}`,
            {
              phNo: phone,
            },
            {
              headers: { token },
            }
          )
          .then((res) => {
            navigate(`/home`);
          })
          .catch((err) => {
            alert("error");
          });
      }
    } else {
      alert("Canceled!");
    }
  };
  return (
    <div>
      <div className="container mt-4 mb-4 p-3 d-flex justify-content-center">
        <div className="card p-4 " style={{ "border-radius": "30px" }}>
          <div className=" image d-flex flex-column justify-content-center align-items-center">
            <img
              src={`https://www.w3schools.com/howto/img_avatar.png`}
              height="150"
              width="150"
              alt=""
              style={{ "border-radius": "50%" }}
            />

            <h1 className="name mt-3 text-danger">{organizer.name}</h1>
            <p className="idd text-primary">{organizer.email}</p>
            <div className="d-flex flex-row justify-content-center align-items-center gap-2">
              <h3 className="idd1">{organizer.phNo}</h3>
              <span>
                <i className="fa fa-copy"></i>
              </span>
            </div>
            <div className="d-flex flex-row justify-content-center align-items-center mt-3">
              <span className="number">
                <h3 className="follow">DL No: {organizer.dlNo}</h3>
              </span>
            </div>

            <div className="text mt-3">
              <span>
                <h4>{`${organizer.occupation}`}</h4>
              </span>
            </div>

            <div className=" px-2 rounded mt-2 date ">
              <h3 className="join">{`${organizer.gender}`}</h3>
            </div>
            <div className=" d-flex mt-2">
              {userId !== para.id && (
                <button
                  className="btn1 btn-primary"
                  style={{ "border-radius": "10px" }}
                >
                  <h3>Review user</h3>
                </button>
              )}
              {userId === para.id && (
                <button
                  className="btn1 btn-primary"
                  onClick={changePhone}
                  style={{ "border-radius": "10px" }}
                >
                  <h3>Change Phone Number</h3>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
