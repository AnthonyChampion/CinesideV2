import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext.jsx';

import HomePage from './pages/HomePage.jsx';
import TopRatedPage from './pages/TopRatedPage.jsx';
import MoviesPage from './pages/MoviesPage.jsx';
import FavoritePage from "./pages/FavoritePage.jsx";
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import MovieDetailPage from './pages/MovieDetailPage.jsx';



const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <HomePage />,
        path: "/",
      },
      {
        element: <LoginPage />,
        path: "/connexion",
      },
      {
        element: <RegisterPage />,
        path: "/inscription",
      },
      {
        element: <MoviesPage />,
        path: "/films",
      },
      {
        element: <MovieDetailPage />,
        path: "/film/:id",
      },
      {
        element: <FavoritePage />,
        path: "/favoris",
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
