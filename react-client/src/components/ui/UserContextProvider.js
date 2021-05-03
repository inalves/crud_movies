import React, {createContext, useState} from 'react'

const UserContextProvider = (props) => {
    const [userContext, setUserContext] = useState({})

    return (
        <div>
            <AppContext.Provider value={[userContext, setUserContext]}>
                {props.children}
            </AppContext.Provider>
        </div>
    )
}

export default UserContextProvider;
export const AppContext = createContext();
