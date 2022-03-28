import { observer } from "mobx-react-lite";
import React from "react";
import { Card, Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import ProfileCard from "./ProfileCard";

const ProfileFollowings = () => {
  const { profileStore } = useStore();
  const { loadingFollowings, followings, profile, activeTab } = profileStore;
  const predicate = activeTab === 3 ? "Followers" : activeTab === 4 ? "Following" : "";

  return (
    <Tab.Pane loading={loadingFollowings}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="user" content={predicate} />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={10}>
            {followings.map((profile) => (
              <ProfileCard key={profile.userName} profile={profile} />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileFollowings);
