import React, { useState, useContext } from "react";
import {RecipesContext} from '../store/recipes-context';
import { useNavigate } from 'react-router-dom';
import Auth from "./auth"

const Login = props => {

  const recipesContext = useContext(RecipesContext);
  let navigate = useNavigate();

  const initialUserState = {
    name: "",
    id: "",
    password: ""
  };

  const [user, setUser] = useState(initialUserState);
  const [errorMsg, setMsg] = useState('');


  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handlePasswordChange = async event => {
    const password = event.target.value;
    setUser({ ...user, password: password });
  };

  const login = async (event) => {
    event.preventDefault(); // prevent reload the page
      const loginError = await recipesContext.login(user);
      if(loginError) {
        setMsg(loginError);
      } else{
        navigate('/');
      }
  }

  return (
    <Auth authFun={login} handleInputChange={handleInputChange}
    handlePasswordChange={handlePasswordChange} authPage="login" errorMsg={errorMsg} ></Auth>
  );
};

export default Login;
