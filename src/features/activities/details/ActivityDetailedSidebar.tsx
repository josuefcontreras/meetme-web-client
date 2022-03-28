import React from "react";
import { Segment, List } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { Activity } from "../../../app/models/activity";
import ActivityDetailedSidebarItem from "./ActivityDetailedSidebarItem";

interface Props {
  activity: Activity;
}

const ActivityDetailedSidebar = ({ activity }: Props) => {
  const { attendees, host } = activity;
  return (
    <>
      <Segment
        textAlign="center"
        style={{ border: "none" }}
        attached="top"
        secondary
        inverted
        color="teal"
      >
        {attendees.length} {attendees.length === 1 ? "person" : "people"} going
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {attendees.find((a) => a.userName === host?.userName) && (
            <ActivityDetailedSidebarItem attendee={host!} isHost={true} />
          )}
          {attendees
            .filter((a) => a.userName !== host?.userName)
            .map((attendee) => (
              <ActivityDetailedSidebarItem
                key={attendee.userName}
                attendee={attendee}
                isHost={false}
              />
            ))}
        </List>
      </Segment>
    </>
  );
};

export default observer(ActivityDetailedSidebar);
