import React, {useState} from "react";
import { toast } from "react-toastify";
import { isEmail } from "validator";
import { useSelector, useDispatch } from "react-redux";

import { Container } from "../../styles/GlobalStyles";
import { Form } from "./styled";
import Loading from "../../components/Loading";
import * as actions from '../../store/modules/auth/actions'


export default function Register() {
  const dispatch = useDispatch();

  const id = useSelector(state => state.auth.user.id);
  const nameStored = useSelector(state => state.auth.user.name);
  const emailStored = useSelector(state => state.auth.user.email);
  const isLoading = useSelector(state => state.auth.user.isLoading);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  React.useEffect(() => {
    if(!id) return;

    setName(nameStored);
    setEmail(emailStored);
  }, [emailStored, id, nameStored]);

  async function handleSubmit(e) {
    e.preventDefault();
    let formErrors = false;

    if(name.length < 3 || name.length > 255) {
      formErrors = true;
      toast.error("Name must have between 3 and 255 chars")
    }

    if(!isEmail(email)) {
      formErrors = true;
      toast.error("Email invalid")
    }

    if(!id && (password.length < 6 || password.length > 50)) {
      formErrors = true;
      toast.error("Password must have between 6 and 50 chars")
    }

    if (formErrors) return;

    dispatch(actions.registerRequest({
      name,
      email,
      password,
      id
    }));
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <h1>{id ? 'Edit your data' : 'Create your account'}</h1>

      <Form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Name:
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
          />
        </label>

        <label htmlFor="email">
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Your email"
          />
        </label>

        <label htmlFor="password">
          Password:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Your password"
          />
        </label>

        <button type="submite">{id ? 'Save' : 'Create Account'}</button>
      </Form>
    </Container>
  );
}
