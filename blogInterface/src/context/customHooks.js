import { createContext, useContext } from "react";
export const userContext = createContext(); //setup context
function useUser() {
  const user = useContext(userContext);

  if (!user) {
    throw new Error("user must be used of type user ,check your context");
  }
  return user; //returns the context
}

export default useUser;
