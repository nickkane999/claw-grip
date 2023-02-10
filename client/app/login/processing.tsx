import { setCookie } from "../../src/util/cookies";
type LoginInput = {
  username: string;
  password: string;
};
type CreateAccountInput = {
  username: string;
  password: string;
  passwordConfirm: string;
};
const login = async ({ username, password }: LoginInput) => {
  const res = await fetch("http://localhost:5000/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (data.error) return data.error;
  else {
    console.log("my data");
    console.log(data);
    const accessToken = data.token;
    const userData = data.user;
    setCookie({ name: "loginInfo", value: JSON.stringify({ accessToken, userData }), days: 1 });
    window.location.href = "/";
  }
};

const createAccount = async ({ username, password, passwordConfirm }: CreateAccountInput) => {
  const res = await fetch("http://localhost:5000/users/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, passwordConfirm }),
  });
  const data = await res.json();
  if (data.error) return data.error;
  else {
    const accessToken = data.token;
    const userData = data.user;
    setCookie({ name: "loginInfo", value: JSON.stringify({ accessToken, userData }), days: 1 });
    window.location.href = "/";
  }
};

export { login, createAccount };
