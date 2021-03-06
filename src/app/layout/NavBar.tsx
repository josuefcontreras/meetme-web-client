import React from "react";
import { observer } from "mobx-react-lite";
import { Link, NavLink } from "react-router-dom";
import { Button, Container, Menu, Image, Dropdown, DropdownMenu } from "semantic-ui-react";
import { useStore } from "../stores/store";

const NavBar = () => {
  const { userStore } = useStore();
  const { user, logout, isLoggedIn } = userStore;
  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item as={NavLink} exact to="/" header>
          <img src="/assets/logo.png" alt="logo" style={{ marginRight: "10px" }} />
          Reactivities
        </Menu.Item>
        <Menu.Item as={NavLink} to="/activities" name="Activities" />
        <Menu.Item>
          <Button as={NavLink} to="/createActivity" positive content="Create Activity" />
        </Menu.Item>
        {isLoggedIn && (
          <Menu.Item position="right">
            <Image src={user?.image || "/assets/user.png"} avatar spaced="right" alt="profile image" />
            <Dropdown pointing="top left" text={user?.displayName}>
              <DropdownMenu>
                <Dropdown.Item as={Link} to={`/profiles/${user?.userName}`} text="My Profile" icon="user" />
                <Dropdown.Item text="Logout" icon="power" onClick={logout} />
              </DropdownMenu>
            </Dropdown>
          </Menu.Item>
        )}
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
