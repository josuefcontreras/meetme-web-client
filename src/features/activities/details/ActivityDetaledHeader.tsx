import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Header, Item, Segment, Image, Label } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { format } from "date-fns";
import { useStore } from "../../../app/stores/store";

const activityImageStyle = {
  filter: "brightness(30%)",
};

const activityImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
};

interface Props {
  activity: Activity;
}

const ActivityDetailedHeader = ({ activity }: Props) => {
  const { activityStore } = useStore();
  const { updateAttendance, loading, cancelActivityToggle } = activityStore;

  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0" }}>
        {activity.isCancelled && (
          <Label
            style={{ position: "absolute", zIndex: 10, left: -25, top: 20, fontSize: "1.5rem" }}
            ribbon
            color="red"
            content="CANCELLED"
          />
        )}
        <Image
          src={`/assets/categoryImages/${activity.category}.jpg`}
          fluid
          style={activityImageStyle}
        />
        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header size="huge" content={activity.title} style={{ color: "white" }} />
                <p>{format(activity.date!, "dd MMM yyyy")}</p>
                <p>
                  Hosted by
                  <Link to={`/profiles/${activity.host?.userName}`}>
                    <strong> {activity.host?.displayName}</strong>
                  </Link>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached="bottom">
        {activity.isHost && (
          <>
            <Button
              onClick={cancelActivityToggle}
              color={activity.isCancelled ? "green" : "red"}
              floated="left"
              loading={loading}
              basic
            >
              {activity.isCancelled ? "Activate" : "Cancel"} Event
            </Button>
            <Button color="orange" floated="right" as={Link} to={`/manage/${activity.id}`}>
              Manage Event
            </Button>
          </>
        )}

        {!activity.isHost && !activity.isCancelled && activity.isGoing && (
          <Button loading={loading} onClick={updateAttendance}>
            Cancel attendance
          </Button>
        )}

        {!activity.isHost && !activity.isCancelled && !activity.isGoing && (
          <Button loading={loading} onClick={updateAttendance} color="teal">
            Join Activity
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityDetailedHeader);