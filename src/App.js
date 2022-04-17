import React, { useContext, useEffect, useState } from "react";

import './App.css';
import { Route, Navigate } from "react-router-dom";
import { Routes } from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import AddReview from "./components/add-review";
import Recipe from "./components/recipe";
import Recipes from "./components/recipes";
import Login from "./components/login";
import AddRecipe from "./components/add-recipe";
import SignUp from "./components/sign-up";

import Header from "./components/header";

import {RecipesContext} from './store/recipes-context';
import Loader from "./components/loader";

// import {UserContext} from './store/user-context';


function App() {

  const recipesContext = useContext(RecipesContext); 

  const [isLogedIn, setIsLogedIn] = useState(false)
  const [isFullyLoaded, setIsFullyLoaded] = useState(false) // in order to make app.js working with the updated isLogedIn

 
  useEffect(()=>{
    recipesContext.readCookie().then((res) => {
      setIsLogedIn(res);
      setIsFullyLoaded(true);
    });
  },[])

  if(isFullyLoaded) {
    
  return (
    <div>
      
      <Header/>

      <div className="container mt-3">
        <Routes>
          <Route exact path={"/"}
                 element={<Recipes/>}
            />
            <Route exact path={"/recipes"}
                   element={<Recipes/>}
            />
          <Route
            path="/recipes/:id/review"
            element={ <AddReview/>}
          />
          <Route
            path="/recipes/:id"
            element={<Recipe/>}
          />
          <Route
            path="/add-recipe"
            element={<AddRecipe/>}
          />
          <Route
            path="/recipes/add-recipe"
            element={<AddRecipe/>}
          />
          <Route 
            path="/login"
            element={ isLogedIn? <Navigate to="/"/> : <Login/>}
          />
          <Route
            path="/sign-up"
            element={ isLogedIn? <Navigate to="/"/> : <SignUp/>}
          />
        </Routes>
      </div>
    </div>
  );
} else{
  return (
  <Loader/>
  )
}
}

export default App;
