import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { Image, List } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";

interface Props {
  attendees: Profile[];
}

const ActivityListItemAttendee = ({ attendees }: Props) => {
  return (
    <List horizontal>
      {attendees.map((attendee) => (
        <List.Item key={attendee.userName} as={Link} to={`/profiles/${attendee.userName}`}>
          <Image
            size="mini"
            circular
            src={attendee.image || "/assets/user.png"}
            alt="profile image"
            bordered
            style={attendee.following ? styles.imageStyle : null}
          />
        </List.Item>
      ))}
    </List>
  );
};

const styles = {
  imageStyle: { borderColor: "orange", borderWidth: 4 },
};
export default observer(ActivityListItemAttendee);
