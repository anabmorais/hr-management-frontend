import React from "react";
import { Redirect, Route } from "react-router-dom";
import { getToken } from "../utils/auth";

// https://reacttraining.com/react-router/web/example/auth-workflow
const PrivateRoute = ({ children, ...rest }) => (
  <Route
    {...rest}
    render={({ location }) =>
      getToken() ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: location }
          }}
        />
      )
    }
  />
);

export default PrivateRoute;
