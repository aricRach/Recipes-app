import React, { useState, useContext } from "react";
import {RecipesContext} from '../store/recipes-context';
import {useNavigate} from "react-router-dom";
import Auth from "./auth"

const SignUp = props => {

  const navigate = useNavigate();
  const recipesContext = useContext(RecipesContext); 

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

  const signUp = async (event) => {
    event.preventDefault(); // prevent reload the page
      const loginError = await recipesContext.signUp(user);
      if(loginError) {
        setMsg(loginError);
      } else{
        navigate('/');
      }
  }

  return (
    <Auth authFun={signUp} handleInputChange={handleInputChange}
     handlePasswordChange={handlePasswordChange} authPage="signUp" errorMsg={errorMsg} ></Auth>
  );
};

export default SignUp;
