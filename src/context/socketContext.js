import React, { createContext, useState } from "react";

const SocketContext = createContext();

const ContextProvider = ({ children }) => {
  const [LoggedIn, setLogin] = useState(false);
  const [uemail, setMail] = useState("");
  const [pass, setPass] = useState("");
  const [token, setToken] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [userId, setId] = useState("");
  const [userBooked, setBooked] = useState([]);
  const [created, setCreated] = useState([]);
  return (
    <SocketContext.Provider
      value={{
        created,
        setCreated,
        userBooked,
        setBooked,
        LoggedIn,
        setLogin,
        uemail,
        setMail,
        pass,
        setPass,
        token,
        setToken,
        attempted,
        setAttempted,
        userId,
        setId,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
