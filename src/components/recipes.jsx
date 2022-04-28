import React, { useEffect, useContext, useState } from "react";
import {Link, useLocation} from "react-router-dom";
import { AiOutlineZoomOut } from "react-icons/ai";
import '.././App.css';
import {RecipesContext} from '../store/recipes-context';
import defaultImg from '../assets/defaultImg.json';
import Loader from "./loader";


const Recipes = props => {
  const [isLoading,setIsLoading] = useState(true)
  const [mainSearchName,setMainSearchName] = useState('')
  const [mainSearchCusine,setmainSearchCusine] = useState('All Cuisines')
  const [triggerPageChange,setTriggerPageChange] = useState(false);

  const recipesContext = useContext(RecipesContext);
  const location = useLocation();

  useEffect(() => {
    if (location.state && !location.state.resetRecipes) {
      setIsLoading(false);
      window.history.replaceState({}, document.title)
    } else {
      setIsLoading(true);
      recipesContext.retrieveRecipes().then(response => {
        recipesContext.setRecipes(response.data.recipes);
        setIsLoading(false);
        recipesContext.setIsLoading(false);
      })
      .catch(e => {
        console.log(e);
        setIsLoading(false);
        recipesContext.setIsLoading(false);
      });;
    }
    recipesContext.readCookie();
    recipesContext.retrieveCuisines();
  }, []);

  useEffect(() => {
    if(triggerPageChange) {
      console.log(recipesContext.page)
      setIsLoading(true);
        recipesContext[recipesContext.lastSearch.name](recipesContext.lastSearch.searchValue).then(response => {
        recipesContext.setRecipes(response.data.recipes ? response.data.recipes : response.data);
        setIsLoading(false);
        recipesContext.setIsLoading(false);
      })
      .catch(e => {
        console.log(e);
        setIsLoading(false);
        recipesContext.setIsLoading(false);
      });;
    }
  }, [recipesContext.page]);

  const onChangeSearchName = e => {
    setMainSearchName(e.target.value);
  };

  const onChangeSearchCuisine = e => {
    setmainSearchCusine(e.target.value);
  };

  const findByName = () => {
    setTriggerPageChange(false);
    recipesContext.setPage(0);
    setIsLoading(true);
    recipesContext.setLastSearch({name: 'findByName', searchValue: mainSearchName});
    recipesContext.findByName(mainSearchName, 0).then(response => {
        recipesContext.setRecipes(response.data.recipes);
        setIsLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
  }

  const findByCuisine = () => {
    setTriggerPageChange(false);
    recipesContext.setPage(0);
    setIsLoading(true);
    setMainSearchName('');
    recipesContext.setLastSearch({name: 'findByCuisine', searchValue: mainSearchCusine});
    recipesContext.findByCuisine(mainSearchCusine, 0).then(response => {
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

  const nextPage = () => {
    setTriggerPageChange(true);
    recipesContext.setPage(recipesContext.page+1);
  }
  const prevPage = () => {
    setTriggerPageChange(true);
    recipesContext.setPage(recipesContext.page > 0 ? recipesContext.page-1 : 0);
  }

  if(isLoading || recipesContext.isLoading) return (    
    <Loader/>
)
  return (
    <div>
      {recipesContext.page}    
      <button onClick={nextPage}>next</button>
      <button onClick={prevPage}>prev</button>

        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control input"
            placeholder="Search by name"
            value={mainSearchName}
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
             {recipesContext.cuisines.map((cuisine , index)=> {
               return (
                 <option key={index} value={cuisine}> {cuisine.substr(0, 20)} </option>
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
                  <img src={recipe.image || defaultImg.img} className="card-img-top cover-img" alt="n/a" />
                  <div>
                  <Link className="card-link btn btn-primary col-lg-5 recipe-page-btn" to={"/recipes/"+ getId(recipe)}>
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
          <div className="icon-empty-message">No available recipes were found</div>
          </div>
        )}
    </div>
  );
};

export default Recipes;
