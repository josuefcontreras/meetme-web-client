import { observer } from "mobx-react-lite";
import React from "react";
import { useHistory } from "react-router-dom";
import { Container, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

export default observer(function ServerError() {
  const { error } = useStore().commonStore;
  const history = useHistory();

  if (!error) history.push("/");

  return (
    <Container>
      <Header as="h1" content="Server Error" />
      <Header sub as="h5" color="red" content={error?.message} />
      {error?.details && (
        <Segment>
          <Header as="h4" content="Stack trace" color="teal" />
          <code style={{ marginTop: "10px" }}>{error.details}</code>
        </Segment>
      )}
    </Container>
  );
});
