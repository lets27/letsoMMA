import { useContext } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { createContext } from "react";
import useUser, { userContext } from "./customHooks.js";

import { useEffect } from "react";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem("waguan");

    if (token) {
      // If token exists, you can make a request to get the user data associated with the token
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            "http://localhost:3000/official/user",

            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              mode: "cors",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user data.");
          }

          const userData = await response.json();
          setUser(userData); // Set the user data in state
        } catch (error) {
          console.error(error);
          // Handle the error as needed (e.g., logout the user)
        } finally {
          setLoading(!loading);
        }
      };

      fetchUserData(); // Call the function to fetch user data
    } else {
      // If no token, you might want to clear any existing user data
      setUser(null);
    }
  }, []);
  console.log("this is user", user);
  // Empty dependency array so it runs once on component mount
  const value = useMemo(
    () => ({ user, setUser, loading }),
    [user, setUser, loading]
  );
  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};

// custom hook

export default UserProvider;
