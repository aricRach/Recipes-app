import React, { useState, useRef, useContext, useEffect } from "react";
import RecipesDataService from "../services/recipes";
import { Navigate } from "react-router-dom";
import FileBase64 from 'react-file-base64'
import { FaTrash } from "react-icons/fa";
import {RecipesContext} from '../store/recipes-context';
import { useLocation } from "react-router-dom";
import { FcPlus } from "react-icons/fc";
import Loader from "./loader";

const AddRecipe = props => {

    let initialRecipeState = {
        name: '',
        ingrediens: [],
        instructions: '',
        cuisine: '',
        difficulty: '',
        image: '',
    }

    const location = useLocation();
    const inputIngrediens = useRef(null);
    const recipesContext = useContext(RecipesContext);
    const [recipe, setRecipe] = useState(initialRecipeState);
    const [editing, setEditing] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [inProgress, setInProgress] = useState(false);


    useEffect(() => {
      setInProgress(false);
      recipesContext.readCookie();
      recipesContext.retrieveCuisines();
      if (location.state && location.state.currentRecipe) {
        setEditing(true);
        setRecipe(location.state.currentRecipe);
      }
      recipesContext.setIsLoading(false);
    }, []);

    const handleAddIngredients = () => {
      if(inputIngrediens.current.value != "" && recipe.ingrediens.indexOf(inputIngrediens.current.value) === -1) {
        setRecipe({...recipe, ingrediens: [...recipe.ingrediens, inputIngrediens.current.value]});
      }
      inputIngrediens.current.value = "";
    }
    const deleteIngredient = (item) => {
      const filteredIngredients = recipe.ingrediens.filter(currentIngredient => currentIngredient != item);
      setRecipe({...recipe, ingrediens: [...filteredIngredients]});
  }
    const handleKeypress = e => {
      if (e.charCode === 13) {
        e.preventDefault();
        handleAddIngredients();
      }
    };

    const nameChangeHandler = (event) => {
      setRecipe({...recipe, name: event.target.value});
    }

    const instructionsChangeHandler = (event) => {
      setRecipe({...recipe, instructions: event.target.value});
    }

    const cuisineChangeHandler = (event) => {
      setRecipe({...recipe, cuisine: event.target.value});
    }

    const difficultyChangeHandler = (event) => {
      setRecipe({...recipe, difficulty: event.target.value});
    }

    const setImage = (img) => {
      setRecipe({...recipe, image: img});
    }

    const onSaveClick = async (event) => {
      setInProgress(true);
        event.preventDefault(); // prevent reload the page
        var data = {
            name: recipe.name,
            ingrediens: recipe.ingrediens,
            instructions: recipe.instructions,
            cuisine: recipe.cuisine,
            difficulty: recipe.difficulty || '1',
            userId: recipesContext.user?.id || '1234',
            image: recipe.image || '',
            recipeId: '',
            rating: {
              ratingSum: 0,
              ratingUserCount: 0,
              mapRating: {} 
            }
          };

          if (editing) {
            data.recipeId = location.state.currentRecipe._id;
            await RecipesDataService.updateRecipe(data);
            setSubmitted(true);
          } else {
              await RecipesDataService.createRecipe(data)
              setSubmitted(true);
              }
          };
    
    const onDeleteClick = () => {
      setInProgress(true);
        const recipeId = location.state.currentRecipe._id;
        RecipesDataService.deleteRecipe(recipeId, recipesContext.user.id)
        .then(response => {
          setSubmitted(true);
        })
        .catch(e => {
          console.log(e);
        });

    };

    if(recipesContext.isLoading) return (    
      <Loader/>
   )
    return (
              <div className="form-group">
                  {submitted || !recipesContext.user ? 
                      <Navigate to="/recipes" />
                   : (
                <form onSubmit={onSaveClick} >
                    <label htmlFor="inputName">name</label>
                    <div className="input-group col-lg-4">
                    <input maxLength={24} autoComplete="off" required className="form-control" defaultValue={recipe.name} id="inputName" type="text" onChange={nameChangeHandler} />
                    </div>

                    <label htmlFor="ingrediens">Ingrediens</label>
                    <div className="input-group col-lg-4">
                    <input className="form-control" id="ingrediens"
                    maxLength="30"
                      type="text" ref={inputIngrediens}
                      placeholder="Enter your ingrediens"
                      name="ingrediens"
                      onKeyPress={handleKeypress}
                    />
                    <button type="button" onClick={handleAddIngredients} className="add-ing">
                      <FcPlus/>
                    </button>
                   </div>

             <div className="results align-center"> 
            <ul className="add-ingredients">
              {recipe.ingrediens.map((item) => (
                <div key={item}> 
                  <li className="ingredient-item">
                  {" "}
                  {item}
                  {" "}
                  <button type="button" className="ingredient-delete" onClick={() => deleteIngredient(item)}><FaTrash/></button>
                </li> 
                </div>
              ))}
            </ul>
          </div>

                    <label htmlFor="instructions">Instructions</label>
                    <div className="input-group col-lg-4">
                    <textarea className="form-control" defaultValue={recipe.instructions} type="textarea" id="instructions" onChange={instructionsChangeHandler}/>
                    </div>

                    <label htmlFor="cuisine">cuisine(choose from the list or add a new cuisine)</label>
                    <div className="input-group col-lg-4">
                    <input autoComplete="off" required defaultValue={recipe.cuisine} className="form-control" id="cuisine" type="text" onChange={cuisineChangeHandler} list="cuisinesList" />
                    <datalist id="cuisinesList">
                    {recipesContext.cuisines.slice(1).map((cuisine, index) => {
                      return (
                        <option key={index} value={cuisine}> {cuisine.substr(0, 20)} </option>
                      )
                    })}
                    </datalist>
                    </div>

                    <label htmlFor="selectLevel">select level of difficulty</label>
                    <div className="input-group col-lg-4">
                    <select className="form-control" defaultValue={recipe.difficulty} id="selectLevel" onChange={difficultyChangeHandler}>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    </select>
                    </div>

                    <div className="input-group col-lg-4">
                    <FileBase64 
                    multiple={false}
                    onDone={({base64}) => setImage(base64)}/>
                    <p>
                    <img src={recipe.image} className="img-thumbnail" style={{"maxHeight": "350px"}} alt="n/a" />
                    </p>
                    </div>

                    <div className="input-group col-lg-4">
                    <div className="items-in-row">
                    <button type="submit" disabled={inProgress} className="btn btn-success submit">Submit</button>
                    { editing && <div><button disabled={inProgress} onClick={onDeleteClick} className="btn btn-danger">delete</button></div>}
                    </div>
                    </div>
                </form>
             )}
              </div>
          );
                   };
    export default AddRecipe;
