import React, { useState, useEffect } from "react";
import { get } from "lodash";
import { isEmail, isInt, isFloat } from "validator";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { FaEdit, FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';

import axios from '../../services/axios';
import history from '../../services/history';
import { Container } from "../../styles/GlobalStyles";
import { Form, ProfilePicture, Title } from "./styled";
import Loading from '../../components/Loading'
import * as actions from '../../store/modules/auth/actions';


export default function Student({ match }) {
  const dispatch = useDispatch();
  const id = get(match, 'params.id', '');

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [photo, setPhoto] = useState('');
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function getData() {
      try {
        setisLoading(true);
        const {data} = await axios.get(`/students/${id}`);
        const Photo = get(data, 'Photos[0].url', '');

        setPhoto(Photo);

        setName(data.name);
        setSurname(data.surname);
        setEmail(data.email);
        setAge(data.age);
        setWeight(data.weight);
        setHeight(data.height);

        setisLoading(false);
      }
      catch(err) {
        setisLoading(false);
        const status = get(err, 'response.status', 0);
        const errors = get(err, 'response.data.errors', []);

        if (status === 400) errors.map(error => toast.error(error));
        history.push('/');
      }
    }

    getData();
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    let formErrors = false;

    if(name.length <3 || name.length > 255){
      toast.error('Name must have between 3 and 255 chars');
      formErrors = true;
    }

    if(surname.length <3 || surname.length > 255){
      toast.error('Surname must have between 3 and 255 chars');
      formErrors = true;
    }

    if(!isEmail(email)) {
      toast.error('Invalid email');
      formErrors = true;
    }

    if(!isInt(String(age))) {
      toast.error('Invalid age');
      formErrors = true;
    }

    if(!isFloat(String(weight))) {
      toast.error('Invalid weight');
      formErrors = true;
    }

    if(!isFloat(String(height))) {
      toast.error('Invalid height');
      formErrors = true;
    }

    if(formErrors) return;

    try {
      setisLoading(true);
      if (id) {
        await axios.put(`/students/${id}`, {
          name,
          surname,
          email,
          age,
          weight,
          height,
        });
        toast.success('Student data edited successfully');
      }
      else {
        const data = await axios.post(`/students/`, {
          name,
          surname,
          email,
          age,
          weight,
          height,
        });
        toast.success('Student created successfully');
        history.push(`/student/${data.id}/edit`);
      }

      setisLoading(false);
    }
    catch(err) {
      const status = get(err, 'response.status', 0);
      const data = get(err, 'response.data', {});
      const errors = get(data, 'errors', []);

      if (errors.length > 0) {
        errors.map(error => toast.error(error));
      }
      else {
        toast.error('An unknown error has occurred!');
      }

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title>{id ? 'Edit Student' : 'New Student'}</Title>

      {id && (
        <ProfilePicture>
          {photo ? <img src={photo} alt={name} /> : <FaUserCircle size={180} />}
          <Link to={`/photos/${id}`}>
            <FaEdit size={24} />
          </Link>
        </ProfilePicture>
      )}

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
        />

        <input
          type="text"
          value={surname}
          onChange={e => setSurname(e.target.value)}
          placeholder="Surname"
        />

        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          type="number"
          value={age}
          onChange={e => setAge(e.target.value)}
          placeholder="Age"
        />

        <input
          type="text"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          placeholder="Weight"
        />

        <input
          type="text"
          value={height}
          onChange={e => setHeight(e.target.value)}
          placeholder="Height"
        />

        <button type="submit">Send</button>
      </Form>

    </Container>
  );
}

Student.propTypes = {
  match: PropTypes.shape({}).isRequired,
}
