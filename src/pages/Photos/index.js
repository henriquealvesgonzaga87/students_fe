import React from "react";
import { get } from "lodash";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { Container } from "../../styles/GlobalStyles";
import Loading from '../../components/Loading';
import { Title, Form } from './styled';
import axios from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions'


export default function Photos({ match }) {
  const dispatch = useDispatch();
  const id = get(match, 'params.id', '');

  const [isLoading, setIsloading] = React.useState(false);
  const [photo, setPhoto] = React.useState('');

  React.useEffect(() => {
    const getData = async () => {
      try {
        setIsloading(true);
        const { data } = await axios.get(`/students/${id}`);
        setPhoto(get(data, 'Photos[0].url', ''));
        setIsloading(false);
      }
      catch(err) {
        toast.error('Error to get the image');
        setIsloading(false);
        history.push('/');
      }
    };

    getData()
  }, [id]);

  const handleChange = async e => {
    const file = e.target.files[0];
    const photoURL = URL.createObjectURL(file);

    setPhoto(photoURL);

    const formData = new FormData();
    formData.append('student_id', id);
    formData.append('photo', file);

    try {
      setIsloading(true);

      await axios.post('/photos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Photo sent successfully!');

      setIsloading(false);
    }
    catch(err) {
      setIsloading(false);
      const { status } = get(err, 'response', '');
      toast.error('Error to send the photo');

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title>Photos</Title>

      <Form>
        <label htmlFor="photo">
          {photo ? <img src={photo} alt="Photo" /> : 'Select'}
          <input type="file" id="photo" onChange={handleChange} />
        </label>
      </Form>
    </Container>
  );
}

Photos.propTypes = {
  match: PropTypes.shape({}).isRequired,
}
