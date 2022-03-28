import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { Item, Label, Image } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";

interface Props {
  attendee: Profile;
  isHost: boolean;
}

const ActivityDetailedSidebarItem = ({ attendee, isHost }: Props) => {
  const item = (
    <Item key={attendee.userName} style={{ position: "relative" }}>
      {isHost && (
        <Label style={{ position: "absolute" }} color="orange" ribbon="right">
          Host
        </Label>
      )}
      <Image size="tiny" src={attendee.image || "/assets/user.png"} />
      <Item.Content verticalAlign="middle">
        <Item.Header as="h3">
          <Link to={`/profiles/${attendee.userName}`}>{attendee.displayName}</Link>
        </Item.Header>
        {attendee.following && <Item.Extra style={{ color: "orange" }}>Following</Item.Extra>}
      </Item.Content>
    </Item>
  );
  return item;
};

export default observer(ActivityDetailedSidebarItem);
