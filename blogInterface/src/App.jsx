import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserLogin from "./components/authentication/userLogin";
import Parent from "./components/Parent";
import PostForm from "./components/createPost/postForm";
import PostDetails from "./components/postDetails/postDetails";
import EditForm from "./components/editPost/editPost";
import LandingPage from "./components/landing/landingPage";
import ShowBlogs from "./components/myBlogs/showBlogs";
import ErrorPage from "./components/ErrorPage";

// import MainSection from "./components/mainSection/mainSection";
// import PostDetails from "./components/postDetails/postDetails";

function App() {
  const routes = [
    { path: "/", element: <LandingPage /> },

    {
      path: "/login",
      element: <UserLogin />,
    },
    {
      path: "/official",

      element: <Parent />,
    },
    {
      path: "/myblogs",

      element: <ShowBlogs />,
    },
    {
      path: "/postform",

      element: <PostForm />,
    },
    {
      path: "/edit/:postid",

      element: <EditForm />,
    },
    {
      path: "/details/:postid",

      element: <PostDetails />,
    },
    {
      path: "*",
      element: <ErrorPage />, // Render custom error component
    },
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}

export default App;
