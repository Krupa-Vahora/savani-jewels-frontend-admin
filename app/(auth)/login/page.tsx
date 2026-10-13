"use client";
import LoginForm from "./components/LoginForm";
import { LoginContextProvider } from "./LoginContext";

const Login = () => {
  return (
    <LoginContextProvider>
      <LoginForm />
    </LoginContextProvider>
  );
};

export default Login;
