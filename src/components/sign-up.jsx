import React, { useState, useContext } from "react";
import {UserContext} from '../store/user-context';
import {RecipesContext} from '../store/recipes-context';
import {useNavigate} from "react-router-dom";


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
    <div className="submit-form">
      <h1>{errorMsg}</h1>
      <form onSubmit={signUp} >
      <label htmlFor="name">Username</label>
      <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            id="name"
            required
            value={user.name}
            onChange={handleInputChange}
            name="name"
          />
        </div>

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
          sign UP 
        </button>
        </form>
    </div>
  );
};

export default SignUp;
