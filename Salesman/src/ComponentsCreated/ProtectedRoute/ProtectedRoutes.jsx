import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../../Config/axios.js";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/checksalesman", {
          withCredentials: true,
        });
        console.log(res);  // Debugging here

        if (res.data?.status) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        setAuthenticated(false);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return authenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
