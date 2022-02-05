import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';

import Auth from '../utils/auth';

import { Form, FormField, Label, FormGroup } from '../styles/FormStyle';

import { Button, Container } from '../styles/GenericStyles';

const Login = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, data }] = useMutation(LOGIN_USER);

  // update state based on form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState, [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);
    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    // clear form values
    setFormState({
      email: '',
      password: '',
    });
  };

  return (
    <Container>
          <h4>Login</h4>
            {data ? (
              <p>
                Success! Logging you in
              </p>
            ) : (
              <Form onSubmit={handleFormSubmit}>

                <FormGroup>
                  <Label>Email</Label>
                  <FormField
                  className="form-input"
                  placeholder="Your email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleInputChange}>
                  </FormField>
                  </FormGroup>

                  <FormGroup>
                  <Label>Password</Label>
                  <FormField
                  className="form-input"
                  placeholder="******"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleInputChange}>
                  </FormField>
                  </FormGroup>
                
                <Button type="submit">Submit</Button>
              </Form>
            )}

            {error && (
              <div>
                {error.message}
              </div>
            )}
    </Container>
  );
};

export default Login;
