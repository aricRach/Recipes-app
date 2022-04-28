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
  const [isLoading,setIsLoading] = useState(false)
  const [page,setPage] = useState(0)
  const [lastSearch,setLastSearch] = useState({name: 'retrieveRecipes'})


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
  const searchMyRecipes = (searchPage) => {
    setLastSearch({name: 'searchMyRecipes'});
    return RecipesDataService.findMyRecipes(user.id, 'id', searchPage != null ? searchPage : page);
  };

  const searchFavoritesRecipes = (searchPage) => {
    setLastSearch({name: 'searchFavoritesRecipes'});
    return RecipesDataService.findFavorites(user.id, searchPage != null ? searchPage : page);
};

  const retrieveRecipes = () => {
      return RecipesDataService.getAll(page);
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

  const find = (query, by, page = 0) => {
    return RecipesDataService.find(query, by, page);
  };

  const findByName = (nameToSearch, searchPage) => {
    return find(nameToSearch, "name", searchPage != null ? searchPage : page)
  };

  const findByCuisine = (cuisineToSearch, searchPage) => {
    if (cuisineToSearch === "All Cuisines") {
      return RecipesDataService.getAll();
    } else {
      return find(cuisineToSearch, "cuisine", searchPage != null ? searchPage : page);
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
    searchFavoritesRecipes: searchFavoritesRecipes,
    isLoading: isLoading,
    setIsLoading:setIsLoading,
    page: page,
    setPage: setPage,
    lastSearch:lastSearch,
    setLastSearch:setLastSearch,
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

