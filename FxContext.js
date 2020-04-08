import React, {useState, useCallback} from 'react';

const FxContext = React.createContext({});

const FxProvider = props => {
  const [mFunc, setMFunction] = useState();
  const setMFunc = useCallback(arg => {
    setMFunction(arg);
  }, []);
  return (
    <FxContext.Provider value={{mFunc, setMFunc}}>
      {props.children}
    </FxContext.Provider>
  );
};

export default FxContext;

export {FxProvider};
