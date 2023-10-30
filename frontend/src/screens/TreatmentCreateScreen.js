import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function TreatmentCreateScreen() {
  const navigate = useNavigate();

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/treatments',
        {
          name,
          type,
          description,
          duration,
          
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      toast.success('Treatment created successfully');
      navigate('/admin/treatments');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Container className="small-container">
      <h1>Create Treatment</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="type">
          <Form.Label>Type</Form.Label>
          <Form.Control
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="duration">
          <Form.Label>Duration (in days)</Form.Label>
          <Form.Control
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </Form.Group>
        
        <Button
          style={{
            backgroundColor: '#3AD784',
            color: '#FFFFFF',
            borderRadius: '10px',
            fontSize: '16px',
            height: '32px',
            width: '140px',
            textAlign: 'center',
            border: 'none',
            cursor: 'pointer',
          }}
          type="submit"
        >
          Create
        </Button>
      </Form>
    </Container>
  );
}
