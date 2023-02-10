import React, { useState, useEffect, useRef, memo } from "react";
import { Form, Button, Container } from "react-bootstrap";
import "./Login.css";
import { useLazyQuery, useMutation } from "@apollo/client";
import { LOGIN_USER, CREATE_USER } from "../../graphQL/queries";
import { setCookie } from "../../src/utils/cookies";

function Login() {
  const loginUserRef = useRef();
  const createUserRef = useRef();
  const loginErrorRef = useRef();
  const createAccountErrorRef = useRef();

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [createUsername, setCreateUsername] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createPasswordConfirm, setCreatePasswordConfirm] = useState("");

  const [loginError, setLoginError] = useState("");
  const [createAccountError, setCreateAccountError] = useState("");
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState(null);

  // Updating form logic on input / variable changes
  // Redirect to homepage after successful login
  useEffect(() => {
    loginUserRef.current.focus();
  }, []);

  useEffect(() => {
    if (success) {
      window.location.href = "/";
    }
  }, [success]);

  // Form logic for login and Account creation
  const login = async (e) => {
    e && e.preventDefault();
    let loginInput = {};
    if (e) {
      loginInput = {
        username: loginUsername,
        password: loginPassword,
      };
    } else {
      loginInput = {
        username: createUsername,
        password: createPassword,
      };
    }
    console.log(loginInput);
    loginUser({
      variables: { loginInput },
    });
  };

  const createAccount = async (e) => {
    e.preventDefault();
    createUserAccount({
      variables: {
        createUserInput: {
          username: createUsername,
          password: createPassword,
          confirmPassword: createPasswordConfirm,
        },
      },
    });
  };

  const [loginUser] = useLazyQuery(LOGIN_USER, {
    onCompleted: (result) => {
      setData(result);
      processUserData(result);
    },
    onError: (error) => {
      console.log(error);
      setLoginError("Invalid username or password, the account does not exist, or there was an error on the server. Check the console for more information");
      setLoginPassword("");
      loginErrorRef.current.focus();
    },
  });

  const [createUserAccount] = useMutation(CREATE_USER, {
    // If the account creation works, immediately login with the new account
    onCompleted: (result) => {
      login();
    },
    onError: (error) => {
      console.log(error);
      setCreateAccountError("Passwords did not match, the user already exists, or there was an error on the server. Check the console for more information");
      setCreatePassword("");
      setCreatePasswordConfirm("");
      createAccountErrorRef.current.focus();
      console.log(createAccountError);
    },
  });

  const processUserData = (data) => {
    if (data) {
      const accessToken = data.login.token;
      const userData = data.login.user;
      setCookie("loginInfo", JSON.stringify({ accessToken, userData }), 1);
      setSuccess(true);
    }
  };

  const { Control, Label, Group } = Form;
  return (
    <div>
      <Container className="login-account account-section">
        <h1>Login</h1>
        <Form autoComplete="off" key="loginForm" name="login-form" onSubmit={login}>
          <p ref={loginErrorRef} className={"errorMessage " + (!loginError ? "hidden" : "")}>
            {loginError}
          </p>
          <Group key="usernameLogin">
            <Label>Username</Label>
            <Control
              ref={loginUserRef}
              type="text"
              id="usernameLogin"
              placeholder="Enter username"
              onChange={(e) => setLoginUsername(e.target.value)}
              value={loginUsername}
              autoComplete="off"
              name="usernameLogin"
              required
            />
          </Group>
          <Group key="passwordLogin">
            <Label>Password</Label>
            <Control
              type="password"
              placeholder="Enter password"
              id="passwordLogin"
              onChange={(e) => setLoginPassword(e.target.value)}
              autoComplete="current-password"
              value={loginPassword}
              name="passwordLogin"
              required
            />
          </Group>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </Container>
      <Container className="create-account account-section">
        <h1>Create Account</h1>
        <Form autoComplete="false" key="createAccountForm" onSubmit={createAccount}>
          <p ref={createAccountErrorRef} className={"errorMessage " + (!createAccountError ? "hidden" : "")}>
            {createAccountError}
          </p>
          <Group key="usernameCreate">
            <Label>Username</Label>
            <Control
              ref={createUserRef}
              type="text"
              placeholder="Enter username"
              id="usernameCreate"
              autoComplete="usernameCreate"
              onChange={(e) => setCreateUsername(e.target.value)}
              value={createUsername}
              name="usernameCreate"
              required
            />
          </Group>
          <Group key="createPassword">
            <Label>Password</Label>
            <Control
              type="password"
              placeholder="Enter password"
              id="createPassword"
              onChange={(e) => setCreatePassword(e.target.value)}
              autoComplete="current-password"
              value={createPassword}
              name="passwordCreate"
              required
            />
          </Group>
          <Group key="createPasswordConfirm">
            <Label>Confirm Password</Label>
            <Control
              type="password"
              placeholder="Confirm password"
              id="createPasswordConfirm"
              autoComplete="current-password"
              onChange={(e) => setCreatePasswordConfirm(e.target.value)}
              value={createPasswordConfirm}
              name="passwordCreateConfirm"
              required
            />
          </Group>
          <Button variant="primary" type="submit">
            Create Account
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default Login;
