import React from "react";
import { Link } from "react-router-dom";
import { Card, Image } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";

interface Props {
  profile: Profile;
}

const ProfileCard = ({ profile }: Props) => {
  return (
    <Card>
      <Image src={profile.image || "/assets/user.png"} size="small" />
      <Card.Content>
        <Card.Header as={Link} to={`/profiles/${profile.userName}`}>
          {profile.displayName}
        </Card.Header>
      </Card.Content>
    </Card>
  );
};

export default ProfileCard;
