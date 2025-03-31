import React from "react";
import { useDispatch } from "react-redux";

import { Container } from "../../styles/GlobalStyle";
import { Title } from "./styled";
import * as exampleActions from '../../store/modules/example/actions'


export default function Login() {
  const dispatch = useDispatch();

  function handleClick(e) {
    e.preventDefault();

    dispatch(exampleActions.clickButtonRequest());
  }
  return (
    <Container>
      <Title>
        Login
        <small>Hey</small>
      </Title>
      <p>Lorem ipsum</p>
      <button type="button" onClick={handleClick}>Send</button>
    </Container>
  );
}
