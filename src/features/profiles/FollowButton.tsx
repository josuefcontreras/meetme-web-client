import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Reveal } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";

interface Props {
  profile: Profile;
}

function FollowButton({ profile }: Props) {
  const { profileStore } = useStore();
  return (
    <Reveal animated="move">
      <Reveal.Content visible style={{ width: "100%" }}>
        <Button fluid color="teal" content={profile.following ? "Following" : "Not following"} />
      </Reveal.Content>
      <Reveal.Content hidden style={{ width: "100%" }}>
        <Button
          fluid
          basic
          loading={profileStore.loadingFollow}
          color={profile.following ? "red" : "green"}
          content={profile.following ? "Unfollow" : "Follow"}
          onClick={() => {
            profileStore.updateFollowing(profile.userName!, !profile.following);
          }}
        />
      </Reveal.Content>
    </Reveal>
  );
}

export default observer(FollowButton);
