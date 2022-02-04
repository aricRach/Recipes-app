import React, { useState, useContext } from "react";
import {UserContext} from '../store/user-context';
import {RecipesContext} from '../store/recipes-context';
import { useNavigate } from 'react-router-dom';

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
    <div className="submit-form">
      <h1 style={{color: "red"}}>{errorMsg.substring(1, errorMsg.length-1)}</h1>

      <form onSubmit={login} >
        <label htmlFor="id">email</label>
        <div className="input-group col-lg-4">
          <input
            type="email"
            className="form-control"
            id="id"
            required
            value={user.id}
            onChange={handleInputChange}
            name="id"
          />
        </div>

        <label htmlFor="password">password</label>
        <div className="input-group col-lg-4">
          <input
            type="password"
            className="form-control"
            id="password"
            required
            onChange={handlePasswordChange}
            name="password"
          />
        </div>

        <button className="btn btn-success submit-btn">
          Login
        </button>
        </form>
    </div>
  );
};

export default Login;
