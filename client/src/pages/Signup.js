import React, { useState } from 'react';

import { useMutation } from '@apollo/client';

import { ADD_USER } from '../utils/mutations'

import Auth from '../utils/auth';

import { Form, FormField, Label, FormGroup } from '../styles/FormStyle';

import { Button, Container } from '../styles/GenericStyles';

const SignupForm = () => {

  // set initial form state
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  // set state for form validation
  const [validated] = useState(false);

  const [addUser ] = useMutation(ADD_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(userFormData);

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
    setUserFormData({
      username: '',
      email: '',
      password: '',
    });

  };

  return (
    <>
    <Container>
      {/* This is needed for the validation functionality above */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* show alert if server response is bad */}

        <FormGroup>
            <Label>Username</Label>
            <FormField
            placeholder="Your username"
            name="username"
            type="text"
            value={userFormData.username}
            onChange={handleInputChange}>
            </FormField>
        </FormGroup>

        <FormGroup>
            <Label>Email</Label>
            <FormField
            placeholder="Your email"
            name="email"
            type="email"
            value={userFormData.email}
            onChange={handleInputChange}>
            </FormField>
        </FormGroup>

        <FormGroup>
            <Label>Password</Label>
            <FormField
            placeholder="Create a password"
            name="password"
            type="password"
            value={userFormData.password}
            onChange={handleInputChange}>
            </FormField>
        </FormGroup>

        <Button
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'>
          Submit
        </Button>
      </Form>
      </Container>
    </>
  );
};

export default SignupForm;
