import { formatDistance } from "date-fns";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Segment, Header, Comment, Loader } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import * as Yup from "yup";
import { Field, FieldProps, Form, Formik } from "formik";
import { Activity } from "../../../app/models/activity";

interface Props {
  activity: Activity;
}

const ActivityDetailedChat = ({ activity }: Props) => {
  const { commentStore } = useStore();

  useEffect(() => {
    if (activity.id) commentStore.createHubConnection(activity.id);
    return () => {
      commentStore.clearComments();
    };
  }, [commentStore, activity.id]);

  const validationSchema = Yup.object({
    body: Yup.string().required(),
  });

  return (
    <>
      <Segment textAlign="center" attached="top" inverted color="teal" style={{ border: "none" }}>
        <Header>Chat about this event {activity.isCancelled && "DISABLED."}</Header>
      </Segment>
      <Segment attached>
        {!activity.isCancelled && (
          <Formik
            onSubmit={(values, { resetForm }) => {
              commentStore.addComment(values).then(() => {
                resetForm();
              });
            }}
            initialValues={{ body: "" }}
            validationSchema={validationSchema}
          >
            {({ isSubmitting, isValid, handleSubmit }) => (
              <Form className="ui form">
                <Field name="body">
                  {(props: FieldProps) => (
                    <div style={{ position: "relative" }}>
                      <Loader active={isSubmitting} />
                      <textarea
                        placeholder="Enter your comment (Enter to submit, shift + enter for new line"
                        rows={2}
                        {...props.field}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && e.shiftKey) {
                            return;
                          }
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            isValid && handleSubmit();
                          }
                        }}
                      ></textarea>
                    </div>
                  )}
                </Field>
              </Form>
            )}
          </Formik>
        )}
        <Comment.Group style={{ maxHeight: 350, overflowY: "scroll" }}>
          {commentStore.comments.map((comment) => (
            <Comment key={comment.id}>
              <Comment.Avatar src={comment.image || "/assets/user.png"} />
              <Comment.Content>
                <Comment.Author
                  as={Link}
                  to={comment.userName ? `/profiles/${comment.userName}` : "#"}
                >
                  {comment.displayName || "user deleted"}
                </Comment.Author>
                <Comment.Metadata>
                  <div>{formatDistance(comment.createdAt, Date.now())} ago</div>
                </Comment.Metadata>
                <Comment.Text style={{ whiteSpace: "pre-wrap" }}>{comment.body}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Segment>
    </>
  );
};

export default observer(ActivityDetailedChat);
