import {createContext ,useState } from "react"

export const UserContext = createContext({
    user: null,
});

const UserContextProvider = (props) => {

    const [user, setUser] = useState(null);

    const login = (user = null) => {
        setUser(user);
    }

    const logout = () => {
        setUser(null)
    }
    

  const contex = {
    user: user,
    login:login,
    logout: logout,
  }


    return (
        <UserContext.Provider value={contex}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;

