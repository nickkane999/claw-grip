"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { notFound } from "next/navigation";
import { login, createAccount } from "./processing";
import "./page.scss";

const { Control, Label, Group } = Form;
function Login() {
  const [formError, setFormError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const loginInput = { username, password, passwordConfirm };
    const loginError = await login(loginInput);
    if (loginError) {
      setFormError(loginError);
    }
  };

  const handleCreateAccount = async (e: any) => {
    e.preventDefault();
    const createAccountInput = { username, password, passwordConfirm };
    const createAccountError = await createAccount(createAccountInput);
    if (createAccountError) {
      setFormError(createAccountError);
    }
  };

  return (
    <>
      <Container className="login-account account-section">
        <h1>Login</h1>
        <p className={"errorMessage " + (!formError ? "hidden" : "")}>{formError}</p>
        <Form autoComplete="off" key="loginForm" name="login-form" onSubmit={handleLogin}>
          <Group key="usernameLogin">
            <Label>Username</Label>
            <Control type="text" id="loginUsername" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} value={username} name="loginUsername" required />
          </Group>
          <Group key="passwordLogin">
            <Label>Password</Label>
            <Control type="password" placeholder="Enter password" id="loginPassword" onChange={(e) => setPassword(e.target.value)} value={password} name="passwordLogin" required />
          </Group>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </Container>
      <Container className="create-account account-section">
        <h1>Create Account</h1>
        <Form autoComplete="false" key="createAccountForm" onSubmit={handleCreateAccount}>
          <Group key="usernameCreate">
            <Label>Username</Label>
            <Control type="text" placeholder="Enter username" id="createUsername" onChange={(e) => setUsername(e.target.value)} value={username} name="createUsername" required />
          </Group>
          <Group key="createPassword">
            <Label>Password</Label>
            <Control type="password" placeholder="Enter password" id="createPassword" onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" value={password} name="passwordCreate" required />
          </Group>
          <Group key="createPasswordConfirm">
            <Label>Confirm Password</Label>
            <Control type="password" placeholder="Confirm password" id="createPasswordConfirm" autoComplete="current-password" onChange={(e) => setPasswordConfirm(e.target.value)} value={passwordConfirm} name="createPasswordConfirm" required />
          </Group>
          <Button variant="primary" type="submit">
            Create Account
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default Login;
