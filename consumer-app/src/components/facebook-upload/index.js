import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import PostUpload from "./PostUpload";
import Collaborator from "./Collaborator";
function FacebookHome() {
  const router = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${router.path}/collaborator`}
          component={Collaborator}
        />
        <Route exact path={`${router.path}`} component={PostUpload} />
      </Switch>
    </div>
  );
}

export default FacebookHome;
