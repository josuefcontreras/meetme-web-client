import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Label } from "semantic-ui-react";
import { MyTextInput } from "../../app/common/form";
import { LoginCredentials } from "../../app/models/loginCredentials";
import { useStore } from "../../app/stores/store";

const LoginForm = () => {
  const { userStore, modalStore } = useStore();
  const { login, loading } = userStore;

  async function handleFormSubmit(values: LoginCredentials) {
    try {
      await login(values);
      modalStore.closeModal();
    } catch (e) {
      throw e;
    }
  }

  return (
    <Formik
      initialValues={{ email: "", password: "", error: null }}
      onSubmit={(values, { setErrors }) => {
        handleFormSubmit(values).catch((error) => {
          setErrors({ error: "Invalid email or password." });
        });
      }}
    >
      {({ handleSubmit, errors }) => {
        return (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput placeholder="email" name="email" type="email" />
            <MyTextInput placeholder="password" name="password" type="password" />
            <ErrorMessage
              name="error"
              render={() => (
                <Label style={{ marginBottom: 10 }} basic color="red" content={errors.error} />
              )}
            />
            <Button loading={loading} positive content="Login" type="submit" fluid />
          </Form>
        );
      }}
    </Formik>
  );
};

export default observer(LoginForm);
