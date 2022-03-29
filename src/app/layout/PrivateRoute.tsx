import React from "react";
import { Redirect, RouteProps, StaticContext } from "react-router";
import { Route, RouteComponentProps } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { useStore } from "../stores/store";
import NavBar from "./NavBar";

interface Props extends RouteProps {
  component:
    | React.ComponentType<any>
    | React.ComponentType<RouteComponentProps<any, StaticContext, unknown>>
    | undefined;
}

function PrivateRoute({ component, ...routeProps }: Props) {
  const { isLoggedIn } = useStore().userStore;
  const redirectRoute = <Redirect to={"/"} />;
  const privateRoute = (
    <>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <Route component={component} {...routeProps} />;
      </Container>
    </>
  );
  return isLoggedIn ? privateRoute : redirectRoute;
}

export default PrivateRoute;
