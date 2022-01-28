import React, { useState } from 'react';

import { useMutation } from '@apollo/client';

import { EDIT_USER } from '../utils/mutations'

import Auth from '../utils/auth';

import { Form, Alert, Button } from 'react-bootstrap'; //migrate to Styled Components

const EditUserForm = () => {

    //Initial form state
    //change values to curren5t username and email
    const [editUserData, setEditUserData] = useState({ username: '', email: ''  });

    // set state for form validation
    const [validated] = useState(false);
    // set state for alert
    const [showAlert, setShowAlert] = useState(false);

    const [editUser ] = useMutation(EDIT_USER);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditUserData({ ...editUserData, [name]: value });
      };

      const handleFormSubmit = async (event) => {
        event.preventDefault();
        console.log(editUserData);
    
        // check if form has everything (as per react-bootstrap docs)
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
    
        try {
          const { data } = await editUser({
            variables: { ...editUserData },
          });
    
          Auth.login(data.editUser.token);
        } catch (e) {
          console.error(e);
          setShowAlert(true);
        }
        setEditUserData({
            //set to new values
          username: '',
          email: '',
        });
      };

      return (
        <>
          {/* This is needed for the validation functionality above */}
          <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
            {/* show alert if server response is bad */}
            <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
              Error in updating your profile!
            </Alert>
    
            <Form.Group>
              <Form.Label htmlFor='username'>Username</Form.Label>
              <Form.Control
                type='text'
                placeholder='Your username'
                name='username'
                onChange={handleInputChange}
                value={editUserData.username}
                required
              />
              <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
            </Form.Group>
    
            <Form.Group>
              <Form.Label htmlFor='email'>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Your email address'
                name='email'
                onChange={handleInputChange}
                value={editUserData.email}
                required
              />
              <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
            </Form.Group>
    
            <Button
              disabled={!(editUserData.username && editUserData.email)}
              type='submit'
              variant='success'>
              Submit
            </Button>
          </Form>
        </>
      );
    
};

export default EditUserForm;