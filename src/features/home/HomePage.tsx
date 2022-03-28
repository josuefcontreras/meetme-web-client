import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { Container, Header, Segment, Image, Button } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";

interface LoggedInContentProps {
  username: string;
}

const HomePage = () => {
  const { userStore } = useStore();
  const { isLoggedIn, user } = userStore;

  const LoggedInContent = ({ username }: LoggedInContentProps) => {
    return (
      <>
        <Header as="h2" inverted content={`Hi, ${username}. 👋`} />
        <Button as={Link} to="/activities" size="huge" inverted>
          Go to activities
        </Button>
      </>
    );
  };

  const NonLoggedInContent = () => {
    const { modalStore } = useStore();
    const { openModal } = modalStore;
    return (
      <>
        <Header as="h2" inverted content="Welcome to Reactivities" />
        <Button
          size="huge"
          color="teal"
          onClick={() => {
            openModal(<LoginForm />, "Login");
          }}
        >
          Login
        </Button>
        <Button
          size="huge"
          inverted
          onClick={() => {
            openModal(<RegisterForm />, "Register");
          }}
        >
          Register
        </Button>
      </>
    );
  };

  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container text>
        <Header as="h1" inverted>
          <Image size="massive" src="/assets/logo.png" alt="logo" style={{ marginBottom: 12 }} />
          Reactivities
        </Header>
        {isLoggedIn ? <LoggedInContent username={user!.userName} /> : <NonLoggedInContent />}
      </Container>
    </Segment>
  );
};

export default observer(HomePage);
