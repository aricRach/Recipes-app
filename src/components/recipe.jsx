import React, {useState, useEffect, useRef, useContext} from "react";
import RecipesDataService from "../services/recipes";
import {Link, useParams} from "react-router-dom";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import {RecipesContext} from "../store/recipes-context";
import defaultImg from '../assets/defaultImg.json';
import Loader from "./loader";


const Recipe = props => {

  let params = useParams();
  const recipeIdParam = params.id;
  const recipesContext = useContext(RecipesContext);
  const [isLoading,setIsLoading] = useState(true)


  const initialRecipeState = {
    id: null,
    name: "",
    ingrediens: [],
    cuisine: "",
    reviews: []
  };
  const initialUserState = {
    id: '',
    name: '',
    favorites: []
  };
  const [recipe, setRecipe] = useState(initialRecipeState);
  const [user, setUser] = useState(initialUserState);


  const getRecipe = id => {
    return RecipesDataService.get(id);
  }

  const getUser = id => {
    return RecipesDataService.getUser(id)
  }

  useEffect(() => {
    getRecipe(recipeIdParam).then(response => {
        setRecipe(response.data);
        if(recipesContext.user) {
          getUser(recipesContext.user.id).then(response => {
            setUser(response.data[0]);
          })
          .catch(e => {
            console.log(e);
            console.log('cant get user');
          });
        }
        setIsLoading(false);
      })
      .catch(e => {
        console.log(e);
        console.log('cant get recipe');
      })
  }, [recipeIdParam, recipesContext.user]);

  const deleteReview = (reviewId, index) => {
    RecipesDataService.deleteReview(reviewId, recipesContext.user.id)
      .then(response => {
        setRecipe((prevState) => {
          prevState.reviews.splice(index, 1)
          return({
            ...prevState
          })
        })
      })
      .catch(e => {
        console.log(e);
      });
  };

   const onDeleteRecipeClick = async () => {
   await RecipesDataService.deleteRecipe(recipeIdParam, recipesContext.id);
  }

  const onAddToFavoritesClick = async () => {
    let favArray = user.favorites;
    let favArrayStringIds = favArray.map(fav => fav.$oid);
    const idOfCurrentRecipe = {$oid: recipeIdParam}; // convert to objectId
    if(favArrayStringIds.indexOf(idOfCurrentRecipe.$oid) === -1) {
      favArray.push(idOfCurrentRecipe);
    } else{
      favArray = favArrayStringIds.filter(currentRecipeId => currentRecipeId != idOfCurrentRecipe.$oid);
    }
     setUser({...user, favorites: [...favArray]});
       await RecipesDataService.updateFavorites({
         userId: user.userId,
         favorites: favArray
       });
  }

  if(isLoading) return (    
      <Loader/>
   )
  return (
    <div>
      {recipe ? (
        <div>
          <h5 className="align-center">{recipe.name}</h5>
          <p>
          <img src={recipe.image || defaultImg.img} className="card-img-top contain-img" />
          </p>
          <div className="items-in-row align-center">
            <strong>Cuisine: </strong> {recipe.cuisine}<br/>
          {recipesContext && recipesContext.id !== recipe.userId &&
              <div> 
                {user.favorites.map(fav => fav.$oid).indexOf(recipeIdParam) === -1 ?
                                <div className="like-btn" onClick={onAddToFavoritesClick}><FcLikePlaceholder/></div> : 
                                <div className="like-btn" onClick={onAddToFavoritesClick}><FcLike/></div>

                 }
              </div>
             }
          </div>

                       <h4>ingrediens</h4>
             <div className="results"> 
            <ul>
              {recipe.ingrediens.map((item) => (
                <div> 
                  <li className="ingredient-item">
                  {" "}
                  {item}
                  {" "}
                </li>
                </div>
              ))}
            </ul>
          </div>
          
          <h4>instructions</h4>
          <div className="instructions-text results">
            {recipe.instructions}
          </div>
          <div>
          { recipesContext && recipesContext.id === recipe.userId &&
             <button onClick={onDeleteRecipeClick} className="btn btn-danger">Delete Recipe</button>
             }
             </div>
          <div className="results">
          
          </div>
          <div className="items-in-row">
          <h4 style={{marginRight: "5px"}}> Reviews </h4>
          <Link  style={{marginBottom: "5px"}} to={"/recipes/" + recipeIdParam + "/review"} className="btn btn-primary">
            Add Review
          </Link>
          </div>
          <div className="row">
            {recipe.reviews.length > 0 ? (
             recipe.reviews.map((review, index) => {
               return (
                 <div className="col-lg-4 pb-1" key={index}>
                   <div className="card">
                     <div className="card-body">
                       <p className="card-text">
                         {review.text}<br/>
                         <strong>User: </strong>{review.name}<br/>
                         <strong>Date: </strong>{review.date}
                       </p>
                       {recipesContext.user && recipesContext.user.id === review.userId &&
                          <div className="row">
                            <Link to={"/recipes/" + recipeIdParam + "/review"}
                              state= {{
                                currentReview: review
                              }}
                             className="btn btn-primary col-lg-5 mx-1 mb-1">Edit</Link>
                              <a onClick={() => deleteReview(review._id, index)} className="btn btn-danger col-lg-5 mx-1 mb-1">Delete</a>
                          </div>                   
                       }
                     </div>
                   </div>
                 </div>
               );
             })
            ) : (
            <div className="col-sm-4">
              <p>No reviews yet.</p>
            </div>
            )}

          </div>

        </div>
      ) : (
        <div>
          <br />
          <p>No recipe selected.</p>
        </div>
      )}
    </div>
  );
};

export default Recipe;
