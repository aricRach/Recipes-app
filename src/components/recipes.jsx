import React, { useEffect, useContext, useState } from "react";
import {Link, useLocation} from "react-router-dom";
import { AiOutlineZoomOut } from "react-icons/ai";
import '.././App.css';
import {RecipesContext} from '../store/recipes-context';
import defaultImg from '../assets/defaultImg.json';
import Loader from "./loader";


const Recipes = props => {
  const [isLoading,setIsLoading] = useState(true)
  const recipesContext = useContext(RecipesContext);
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.currentRecipe) {
      recipesContext.setRecipes(location.state.currentRecipe);
      setIsLoading(false);
    } else{
      recipesContext.retrieveRecipes().then(response => {
        console.log(response.data);
        recipesContext.setRecipes(response.data.recipes);
        setIsLoading(false);
      })
      .catch(e => {
        console.log(e);
        setIsLoading(false);
      });;
    }
    recipesContext.readCookie();
    recipesContext.retrieveCuisines();
  },[]);

  const onChangeSearchName = e => {
    const searchName = e.target.value;
    recipesContext.setSearchNameInput(searchName);
  };

  const onChangeSearchCuisine = e => {
    const searchCuisine = e.target.value;
    recipesContext.setSearchCuisineInput(searchCuisine);
  };

  const findByName = () => {
    setIsLoading(true);
    recipesContext.findByName().then(response => {
        console.log(response.data);
        recipesContext.setRecipes(response.data.recipes);
        setIsLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
  }

  const findByCuisine = () => {
    setIsLoading(true);
    recipesContext.findByCuisine().then(response => {
      console.log(response.data);
      recipesContext.setRecipes(response.data.recipes);
      setIsLoading(false);
    }) 
    .catch(e => {
      console.log(e);
    });
  }

  const getId = (recipe) => {
    return recipe._id.$oid ? recipe._id.$oid : recipe._id;
  }

  if(isLoading) return (    
      <Loader/>
  )
  return (
    <div>    
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control input"
            placeholder="Search by name"
            value={recipesContext.searchName}
            onChange={onChangeSearchName}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary "
              type="button"
              onClick={findByName}
            >
              Search
            </button>
          </div>
        </div>

        <div className="input-group col-lg-4 cousine-search" >

          <select onChange={onChangeSearchCuisine}>
             {recipesContext.cuisines.map(cuisine => {
               return (
                 <option value={cuisine}> {cuisine.substr(0, 20)} </option>
               )
             })}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByCuisine}
            >
              Search
            </button>
          </div>

        </div>
      <div className="row">
        {recipesContext.recipes.map((recipe) => {
          return (
            <div key={getId(recipe)} className="col-lg-4 pb-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{recipe.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted"><strong>Cuisine: </strong>{recipe.cuisine}</h6>
                  <img src={recipe.image || defaultImg.img} className="card-img-top cover-img" />
                  <div>
                  <Link className="card-link" to={"/recipes/"+ getId(recipe)} className="btn btn-primary col-lg-5 recipe-page-btn">
                    recipe page
                  </Link>
                  {recipesContext.user && recipesContext.user.id === recipe.userId &&
                            <Link className="edit-btn btn btn-link" to="/add-recipe"
                              state = {{
                                currentRecipe: recipe
                              }}
                            > Edit</Link>
                       }
                 </div>
                </div>
              </div>
            </div>
          );
        })}
              </div>

        {recipesContext.recipes.length === 0 && (
          <div>
        <div className="not-found-icon-container">
        <div className="line"></div>
        <div className="not-found-icon"><AiOutlineZoomOut/></div>
        <div className="line"></div>
        </div>
          <div class="icon-empty-message">No available recipes were found</div>
          </div>
        )}
    </div>
  );
};

export default Recipes;
