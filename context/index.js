import { createContext, useReducer, useContext } from "react";

import reducer from "./reducer";
import initialState from "./initial-state";

const StateContext = createContext(initialState);

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    (initialState) => initialState
  );

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);

export default StateProvider;
