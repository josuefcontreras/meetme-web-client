import React, { SyntheticEvent, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Tab,
  Grid,
  Header,
  Card,
  Image,
  TabProps,
  Pagination,
  PaginationProps,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { UserActivity } from "../../app/models/profile";
import { format } from "date-fns";
import { useStore } from "../../app/stores/store";
import { PagingParams } from "../../app/models/pagination";

const panes = [
  { menuItem: "Future Events", pane: { key: "future", default: true } },
  { menuItem: "Past Events", pane: { key: "past" } },
  { menuItem: "Hosting", pane: { key: "hosting" } },
];

export default observer(function ProfileActivities() {
  const { profileStore } = useStore();

  const {
    loadUserActivities,
    profile,
    loadingActivities,
    userActivities,
    userActivitiesPagination,
    setPagingParams,
  } = profileStore;

  const [loadingNext, setLoadingNext] = useState(false);
  const [activePaneKey, setActivePaneKey] = useState(
    panes.filter((p) => p.pane.default)[0].pane.key
  );

  function handlePaginationChange(e: SyntheticEvent, data: PaginationProps) {
    setLoadingNext(true);
    setPagingParams(new PagingParams(data.activePage as number, 12));
    loadUserActivities(profile!.userName, activePaneKey).then(() => setLoadingNext(false));
  }

  useEffect(() => {
    loadUserActivities(profile!.userName);
  }, [loadUserActivities, profile]);

  const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
    const paneKey = panes[data.activeIndex as number].pane.key;
    setActivePaneKey(paneKey);
    loadUserActivities(profile!.userName, paneKey);
  };

  return (
    <Tab.Pane loading={loadingActivities}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="calendar" content={"Activities"} />
        </Grid.Column>
        <Grid.Column width={16}>
          <Tab
            panes={panes}
            menu={{ secondary: true, pointing: true }}
            onTabChange={(e, data) => handleTabChange(e, data)}
          />
          <br />
          <Card.Group itemsPerRow={4}>
            {userActivities.map((activity: UserActivity) => (
              <Card as={Link} to={`/activities/${activity.id}`} key={activity.id}>
                <Image
                  src={`/assets/categoryImages/${activity.category}.jpg`}
                  style={{ minHeight: 100, objectFit: "cover" }}
                />
                <Card.Content>
                  <Card.Header textAlign="center">{activity.title}</Card.Header>
                  <Card.Meta textAlign="center">
                    <div>{format(new Date(activity.date), "do LLL")}</div>
                    <div>{format(new Date(activity.date), "h:mm a")}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Grid.Column>
        <Grid.Column width={16}>
          <Pagination
            activePage={userActivitiesPagination?.currentPage}
            onPageChange={handlePaginationChange}
            totalPages={userActivitiesPagination?.totalPages!}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            siblingRange={1}
          />
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
