import React, {useState, useEffect, useRef, useContext} from "react";
import RecipesDataService from "../services/recipes";
import {Link, useParams} from "react-router-dom";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import {RecipesContext} from "../store/recipes-context";
import defaultImg from '../assets/defaultImg.json';
import Loader from "./loader";
import StarRatings from "react-star-ratings";


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
    reviews: [],
    rating: {
      ratingSum: 0,
      ratingUserCount: 0,
      mapRating: { } // will be user: his rating
    }
  };
  const initialUserState = {
    id: '',
    name: '',
    favorites: []
  };
  const [recipe, setRecipe] = useState(initialRecipeState);
  const [user, setUser] = useState(initialUserState);
  const [recipeOwnerName, setRecipeOwnerName] = useState('');

  const [userRating, setUserRating] = useState(initialRecipeState.rating.ratingSum);
  const [totalRating, setTotalRating] = useState(initialRecipeState.rating.ratingSum);
  const [totalUsersRatingCount, setTotalUsersRatingCount] = useState(initialRecipeState.rating.ratingUserCount);

  const getRecipe = id => {
    return RecipesDataService.get(id);
  }

  const getUser = id => {
    return RecipesDataService.getUser(id)
  }

  useEffect(() => {
    getRecipe(recipeIdParam).then(currentRecipe => {
        setRecipe(currentRecipe.data);
        setTotalRatingStars(currentRecipe.data.rating);
        getUser(currentRecipe.data.userId).then(userOwner => {
          setRecipeOwnerName(userOwner.data[0].name);
        });
        if(recipesContext.user) {
          getUser(recipesContext.user.id).then(response => {
            setUser(response.data[0]);
            const prevRatingOfTheUser = currentRecipe.data.rating.mapRating[response.data[0].userId];
            if(prevRatingOfTheUser) {
              setUserRating(+(prevRatingOfTheUser['$numberInt']));
            }
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
  }, [recipeIdParam, recipesContext.user, userRating]);


  const setTotalRatingStars = (rating) => {
    if(rating) {
      const usersCount = rating.ratingUserCount['$numberInt'] | rating.ratingUserCount['$numberDouble'];
      const ratingSum = rating.ratingSum['$numberInt'] | rating.ratingSum['$numberDouble'];
      if(usersCount != 0) {
        setTotalRating(ratingSum/usersCount);
        setTotalUsersRatingCount(usersCount);
      } else {
        setTotalRating(0);
      }
    }
  }


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

  const ingredientChecked = (index) => {
    const element = document.getElementById(index);
    element.classList.toggle("checked");
  }

  const changeRating = async ( newRating, name ) => {
    const data = {
      recipeId: recipeIdParam,
      userId: recipesContext.user.id,
      rating: newRating
    }
    console.log(data.recipeId);
    await RecipesDataService.updateRating(data)
    setUserRating(newRating);
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
          {recipesContext.user && recipesContext.user.id !== recipe.userId &&
              <div> 
                {user.favorites.map(fav => fav.$oid).indexOf(recipeIdParam) === -1 ?
                                <div className="like-btn" onClick={onAddToFavoritesClick}><FcLikePlaceholder/></div> : 
                                <div className="like-btn" onClick={onAddToFavoritesClick}><FcLike/></div>

                 }
              </div>
             }
          </div>
          <div className="align-center" style={{"marginTop": "7px"}}>
            <StarRatings
              rating={totalRating}
              starDimension="40px"
              starSpacing="15px"
              starRatedColor="#f7c600"
            />
          </div>
          <div className="align-center">
          rating reviewers: {totalUsersRatingCount}
          </div>

                       <h4>ingrediens</h4>
             <div className="results"> 
            <ul>
              {recipe.ingrediens.map((item, index) => (
                <div> 
                  <li onClick={() => {ingredientChecked(index)}} id={index} className="ingredient-item">
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
          {recipesContext.user &&
          <div style={{marginBottom: "10px"}} className="items-in-row">
            <span style={{marginRight: "10px", marginTop:"10px"}}>set your rating: </span>
          <StarRatings
                          rating={userRating}
                          starRatedColor="#f7c600"
                          starHoverColor="#f7c600"
                          changeRating={changeRating}
                          numberOfStars={5}
                          name='rating'
                        />
            </div>
}
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
                     <div className="card-body review-card">
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
