import React from "react";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route, Switch, useLocation } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import { ToastContainer } from "react-toastify";
import NotFound from "../../features/errors/NotFound";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import ProfilePage from "../../features/profiles/ProfilePage";
import { useInitialLogInAttempt } from "../hooks";
import ScrollToTop from "./ScrollToTop";
import PrivateRoute from "./PrivateRoute";
import ServerError from "../../features/errors/ServerError";

function App() {
  const location = useLocation();
  const appLoaded = useInitialLogInAttempt();

  if (!appLoaded) return <LoadingComponent content="Loading App..." />;

  return (
    <>
      <ScrollToTop />
      <ToastContainer position="bottom-right" hideProgressBar />
      <ModalContainer size="tiny" dimmer={false} />
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <>
            <Switch>
              <PrivateRoute exact path="/activities" component={ActivityDashboard} />
              <PrivateRoute path="/activities/:id" component={ActivityDetails} />
              <PrivateRoute path="/profiles/:userName" component={ProfilePage} />
              <PrivateRoute key={location.key} path={["/createActivity", "/manage/:id"]} component={ActivityForm} />
              <Route path="/server-error" component={ServerError} />
              <Route component={NotFound} />
            </Switch>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
