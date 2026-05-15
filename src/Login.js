import Axios from "axios";
import { useContext } from "react";
import { SocketContext } from "./../context/socketContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const {
    setLogin,
    attempted,
    setAttempted,
    uemail,
    setMail,
    pass,
    setPass,

    setToken,
    setId,
    setCreated,
    setBooked,
  } = useContext(SocketContext);

  const login = async (e) => {
    setAttempted(false);
    if (uemail === "" || pass === "") alert("Enter all fields");
    else {
      await Axios.post("http://172.20.10.4:8000/api/v1/users/login", {
        email: uemail,
        password: pass,
      })
        .then((res) => {
          setId(res.data.user._id);
          setBooked(res.data.user.booked);
          setCreated(res.data.user.created);
          setToken(res.data.token);

          setLogin(true);
          navigate("/home");
        })
        .catch((err) => {
          setAttempted(true);
        });
    }
  };

  const gotoSingUp = () => {
    navigate("/signup");
  };

  return (
    <div className="text-center" style={{ height: "100%" }}>
      <form
        className="form-signin mx-auto my-5 py-5 w-25"
        style={{ minWidth: "300px" }}
        onSubmit={(e) => e.preventDefault()}
      >
        <img
          className="mb-4 rounded-circle mt-5"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpx4kjcrxKYNZ8bGKpW2KBeTsBmXZja6Z5lQ&usqp=CAU"
          alt=""
          width="72"
          height="72"
        ></img>
        <h1 className="h3 mb-3 font-weight-normal">SIGN IN</h1>
        <label className="sr-only">Email address</label>
        <input
          type="email"
          id="inputEmail"
          className="form-control"
          placeholder="Email address"
          required=""
          onChange={(e) => setMail(e.target.value)}
          value={uemail}
        />
        <label className="sr-only">Password</label>
        <input
          type="password"
          id="inputPassword"
          className="form-control mt-3"
          placeholder="Password"
          required=""
          onChange={(e) => setPass(e.target.value)}
          value={pass}
        />
        {attempted && (
          <p className=" mt-2 mb-4 text-danger font-weight-normal">
            Email or password incorrect
          </p>
        )}

        <button
          className="btn btn-sm btn-primary btn-block mt-3 mb-4"
          type="submit"
          onClick={(e) => login(e)}
        >
          Sign in
        </button>
        <button className="btn btn-dark btn-lg btn-block" onClick={gotoSingUp}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
