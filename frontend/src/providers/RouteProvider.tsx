import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../component/Home";
import App from "../App";
import LoginPage from "../component/LoginPage";
import SignUp from "../component/SignUp";
import Auth from "../AuthPage/Auth";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import ErrorPage from "../component/ErrorPage";
import NotFound from "../component/NotFound";
const Router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function RouteProvider() {
  return <RouterProvider router={Router} />;
}

export default RouteProvider;

