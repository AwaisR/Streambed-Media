import React, { useEffect, useState } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";
import Shell from "../pages/dashboard/Shell";
import Socket from "../components/helpers/socket";
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const history = useHistory();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  useEffect(() => {
    let token = localStorage.getItem("token");

    if (token === "undefined" || token === null || token === "null") {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      history.push("/");
    } else if (token) {
      let tokenExpiration = jwtDecode(token).exp;
      let dateNow = new Date();
      if (tokenExpiration < dateNow.getTime() / 1000) {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      } else {
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      history.push("/");
    }
    // eslint-disable-next-line
  }, []);

  if (isAuthenticated === null) {
    return <></>;
  }
  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated ? (
          <Redirect to="/login" />
        ) : (
          <Shell>
            <Socket isAuthenticated={isAuthenticated}>
              <Component {...props} />
            </Socket>
          </Shell>
        )
      }
    />
  );
};

export default ProtectedRoute;
