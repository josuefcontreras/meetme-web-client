import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button } from "semantic-ui-react";
import { MyTextInput } from "../../app/common/form";
import { RegistrationFormValues } from "../../app/models/registrationFormValues";
import { useStore } from "../../app/stores/store";
import * as Yup from "yup";
import ValidationErrors from "../errors/ValidationErrors";

const RegisterForm = () => {
  const { userStore, modalStore } = useStore();
  const { register, loading } = userStore;

  async function handleFormSubmit(values: RegistrationFormValues) {
    try {
      await register(values);
      modalStore.closeModal();
    } catch (e) {
      throw e;
    }
  }

  const validationSchema = Yup.object({
    displayName: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    username: Yup.string().required(),
  });

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{ displayName: "", email: "", password: "", username: "", error: null }}
      onSubmit={(values, { setErrors }) => {
        handleFormSubmit(values).catch((error) => {
          setErrors({ error });
        });
      }}
    >
      {({ handleSubmit, errors, isValid, dirty, isSubmitting }) => {
        return (
          <Form className="ui form error" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput placeholder="username" name="username" type="text" />
            <MyTextInput placeholder="display name" name="displayName" type="text" />
            <MyTextInput placeholder="email" name="email" type="email" />
            <MyTextInput placeholder="password" name="password" type="password" />
            <ErrorMessage name="error" render={() => <ValidationErrors errors={errors.error} />} />
            <Button
              disabled={!isValid || !dirty}
              loading={loading}
              positive
              content="Register Now"
              type="submit"
              fluid
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default observer(RegisterForm);
