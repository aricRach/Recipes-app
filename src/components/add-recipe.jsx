import React, { useState, useRef, useContext, useEffect } from "react";
import RecipesDataService from "../services/recipes";
import { Navigate } from "react-router-dom";
import FileBase64 from 'react-file-base64'
import { FaTrash } from "react-icons/fa";
import {RecipesContext} from '../store/recipes-context';
import { useLocation } from "react-router-dom";
import { FcPlus } from "react-icons/fc";

const AddRecipe = props => {

    const location = useLocation();

    let initialRecipeState = {
        name: '',
        ingrediens: [],
        instructions: '',
        cuisine: '',
        difficulty: '',
        image: '',
    }
    const inputIngrediens = useRef(null);
    const recipesContext = useContext(RecipesContext);

    useEffect(() => {
      recipesContext.readCookie();
    });

    const handleAddIngredients = () => {
      if(inputIngrediens.current.value != "") {
          setUser({...user, ingrediens: [...user.ingrediens, inputIngrediens.current.value]});
      }
      inputIngrediens.current.value = "";
    }
    const deleteIngredient = (item) => {
      const filteredIngredients = user.ingrediens.filter(currentIngredient => currentIngredient != item);
      setUser({...user, ingrediens: [...filteredIngredients]});
  }
    const handleKeypress = e => {
      if (e.charCode === 13) {
        e.preventDefault();
        handleAddIngredients();
      }
    };
  

    let editing = false;

    if (location.state && location.state.currentRecipe) {
        editing = true;
        initialRecipeState = location.state.currentRecipe
      }

    const [user, setUser] = useState(initialRecipeState);
      
    const [submitted, setSubmitted] = useState(false);

    const nameChangeHandler = (event) => {
        setUser({...user, name: event.target.value});
    }

      const instructionsChangeHandler = (event) => {
        setUser({...user, instructions: event.target.value});
    }

    const cuisineChangeHandler = (event) => {
        setUser({...user, cuisine: event.target.value});
    }

    const difficultyChangeHandler = (event) => {
        setUser({...user, difficulty: event.target.value});
    }

    const setImage = (img) => {
        setUser({...user, image: img});
    }

    const onSaveClick = async (event) => {
        event.preventDefault(); // prevent reload the page
        var data = {
            name: user.name,
            ingrediens: user.ingrediens,
            instructions: user.instructions,
            cuisine: user.cuisine,
            difficulty: user.difficulty || '1',
            userId: recipesContext.user?.id || '1234',
            image: user.image || '',
            recipeId: ''
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
        const recipeId = location.state.currentRecipe._id;

        RecipesDataService.deleteRecipe(recipeId, recipesContext.user.id)
        .then(response => {
          setSubmitted(true);
        })
        .catch(e => {
          console.log(e);
        });

    };

    return (
              <div className="form-group">
                  {submitted ? 
                      <Navigate to="/recipes" />
                   : (
                <form onSubmit={onSaveClick} >
                    <label htmlFor="inputName">name</label>
                    <div className="input-group col-lg-4">
                    <input required className="form-control" defaultValue={initialRecipeState.name} id="inputName" type="text" onChange={nameChangeHandler} />
                    </div>

                    <label htmlFor="ingrediens">Ingrediens</label>
                    <div className="input-group col-lg-4">
                    <input className="form-control" id="ingrediens"
                    maxLength="20"
                      type="text" ref={inputIngrediens}
                      placeholder="Enter your ingrediens"
                      name="ingrediens"
                      onKeyPress={handleKeypress}
                    />
                    <button type="button" onClick={handleAddIngredients} className="add-ing">
                      <FcPlus/>
                    </button>
                   </div>

             <div className="results"> 
            <ul>
              {user.ingrediens.map((item) => (
                <div> 
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
                    <textarea className="form-control" defaultValue={initialRecipeState.instructions} type="textarea" id="instructions" onChange={instructionsChangeHandler}/>
                    </div>

                    <label htmlFor="cuisine">cuisine(will be auto complete from the cuisine list)</label>
                    <div className="input-group col-lg-4">
                    <input className="form-control" defaultValue={initialRecipeState.cuisine} id="cuisine" type="text" onChange={cuisineChangeHandler} />
                    </div>

                    <label htmlFor="selectLevel">select level of difficulty</label>
                    <div className="input-group col-lg-4">
                    <select className="form-control" defaultValue={initialRecipeState.difficulty} id="selectLevel" onChange={difficultyChangeHandler}>
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
                    <img src={user.image} className="img-thumbnail" style={{"max-height": "350px"}} />
                    </p>
                    </div>

                    <div className="input-group col-lg-4">
                    <div className="items-in-row">
                    <button type="submit" className="btn btn-success submit">Submit</button>
                    { editing && <div><button onClick={onDeleteClick} className="btn btn-danger">delete</button></div>}
                    </div>
                    </div>
                </form>
             )}
              </div>
          );
                   };
    export default AddRecipe;
