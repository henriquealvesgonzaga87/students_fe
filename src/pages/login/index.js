import React from "react";
import { toast } from "react-toastify";
import { isEmail } from "validator";
import { useDispatch } from "react-redux";
import { get } from "lodash";

import { Container } from "../../styles/GlobalStyles";
import { Form } from './styled'
import * as actions from '../../store/modules/auth/actions'


export default function Login(props) {
  const dispatch = useDispatch();

  const prePath = get(props, 'location.state.prevPath', '/');

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = e => {
    e.preventDefault();
    let formErrors = false;

    if(!isEmail(email)) {
      formErrors = true;
      toast.error("Email invalid")
    }

    if(password.length < 6 || password.length > 50) {
      formErrors = true;
      toast.error("Invalid Credentials")
    }

    if (formErrors) return;

    dispatch(actions.loginRequest({email, password, prePath}));
  }

  return (
    <Container>
      <h1>Login</h1>

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email"
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Your password"
        />

        <button type="submit">Access</button>
      </Form>
    </Container>
  );
}
