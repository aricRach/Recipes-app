import {createContext ,useState} from "react"
import RecipesDataService from "../services/recipes";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export const RecipesContext = createContext({
  recipes: [],
  cuisines: []
});

const RecipesContextProvider = (props) => {
    
const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [cuisines, setCuisines] = useState(["All Cuisines"]);
  const [searchName, setSearchName ] = useState("");
  const [searchCuisine, setSearchCuisine ] = useState("");
  const [isLoading,setIsLoading] = useState(true)

  // user contex
  const [user, setUser] = useState(null);

  const readCookie = async () => {
    const loggedOid = Cookies.get('login');
    if(loggedOid) {
      Cookies.set('login', loggedOid, { expires: 1 });
      if(!user) {
          // need to login
          const currentUser = await RecipesDataService.loginUserOid(loggedOid);
          currentUser.data.id = currentUser.data.userId;
          setUser(currentUser.data);
          return Promise.resolve(true);
      }
    } else {
      setUser(null);
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  }

  const signUp = async (user = null) => {
    try {
      const loggedUser = await RecipesDataService.createUser(user);
      setUser(user);
      Cookies.set('login', loggedUser.data._id.$oid, { expires: 1 });
    } catch(e) {
      return e.response.data.error;
    }
  }

  const login = async (user = null) => {
    try {
      const loggedUser = await RecipesDataService.loginUser(user);
      user['name'] = loggedUser.data.name;
      setUser(user);
      Cookies.set('login', loggedUser.data._id.$oid, { expires: 1 });
    } catch(e) {
      return e.response.data.error;
    }
  }

  const logout = () => {
    Cookies.remove('login');
    setUser(null);
    navigate('/');
  }
// end user contex
  const searchMyRecipes = () => {
    setIsLoading(true);
      RecipesDataService.findMyRecipes(user.id, 'id').then(results => {
        setRecipes(results.data.recipes);
        setIsLoading(false);
      });
  };
  const searchFavoritesRecipes = () => {
    setIsLoading(true);
    RecipesDataService.findFavorites(user.id).then(results => {
      setRecipes(results.data);
      setIsLoading(false);
    });
};

  const retrieveRecipes = () => {
      return RecipesDataService.getAll();
  }

  const retrieveCuisines = () => {
    RecipesDataService.getCuisines()
      .then(response => {
        setCuisines(["All Cuisines"].concat(response.data));
      })
      .catch(e => {
        console.log(e);
      });
  };

  const find = (query, by) => {
    return RecipesDataService.find(query, by);
  };

  const setSearchNameInput = searchNameInput => {
    setSearchName(searchNameInput);
  }

  const setSearchCuisineInput = searchCuisineInput => {
    setSearchCuisine(searchCuisineInput);
  }

  const findByName = () => {
    const searchThisText = searchName;
    setSearchName('');
    return find(searchThisText, "name")
  };

  const findByCuisine = () => {
    if (searchCuisine === "All Cuisines") {
      return RecipesDataService.getAll();
    } else {
      const searchThisCuisine = searchCuisine;
      setSearchCuisine("All Cuisines");
      return find(searchThisCuisine, "cuisine");
    }
  };

  const contex = {
    recipes: recipes,
    cuisines:cuisines,
    setRecipes: setRecipes,
    searchMyRecipes: searchMyRecipes,
    retrieveRecipes: retrieveRecipes,
    retrieveCuisines: retrieveCuisines,
    findByName: findByName,
    findByCuisine: findByCuisine,
    setSearchNameInput:setSearchNameInput,
    setSearchCuisineInput:setSearchCuisineInput,
    searchFavoritesRecipes: searchFavoritesRecipes,
    isLoading: isLoading,
    setIsLoading:setIsLoading,
    //
    user: user,
    login:login,
    signUp:signUp,
    logout: logout,
    readCookie:readCookie

    //
  }

    return (
        <RecipesContext.Provider value={contex}>
            {props.children}
        </RecipesContext.Provider>
    )
}

export default RecipesContextProvider;

