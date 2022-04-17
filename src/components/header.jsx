import React, { useContext } from "react";
import { Link } from "react-router-dom";
import '.././App.css';

import {RecipesContext} from '../store/recipes-context';
import { FcBusinessman } from "react-icons/fc";
import {Dropdown} from 'react-bootstrap';
import {ButtonGroup} from 'react-bootstrap';

const Header = props => {

    const recipesContext = useContext(RecipesContext); 

    return (
    <div>
     <nav className="navbar navbar-expand navbar-dark bg-dark align-user-to-right">
        <Link to={"/recipes"} className="navbar-brand ml-auto main-logo">
        Recipes
        </Link>
        <div className="navbar-nav ml-auto">
        <li className="nav-item" >
            { !recipesContext.user &&            
            <Link reloadDocument to={"/login"} className="nav-link">
            Login
            </Link>
            }
        </li>
        <li className="nav-item" >
            { !recipesContext.user && (
                 <Link reloadDocument to={"/sign-up"} className="nav-link">
                 signUp
                 </Link>
            )}
        </li>
        </div>


        {recipesContext.user && 
        <div className="navbar-right-side">
          <span className="hello-msg" >
        hello {recipesContext.user.name}
        </span>
            <Dropdown as={ButtonGroup}>

            <Dropdown.Toggle split variant="success"><FcBusinessman/></Dropdown.Toggle>

            <Dropdown.Menu >

          <Dropdown.Item as={Link} reloadDocument  to="/add-recipe">
              add recipe
            </Dropdown.Item>

            <Dropdown.Item as={Link} onClick={recipesContext.searchFavoritesRecipes} to="/"
                              state = {{
                                currentRecipe: recipesContext.recipes
                              }}
                            >
              my favorites recipes
            </Dropdown.Item>

            <Dropdown.Item as={Link} onClick={recipesContext.searchMyRecipes} to="/"
                           state = {{
                               currentRecipe: recipesContext.recipes
                           }}
            >
                              search my recipe
            </Dropdown.Item>
            
            <Dropdown.Divider></Dropdown.Divider>
            <Dropdown.Item onClick={recipesContext.logout}>LogOut</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        </div>
        }
    </nav>
</div>
      );
    };
export default Header;
