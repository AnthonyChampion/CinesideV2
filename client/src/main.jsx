import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext.jsx';

import HomePage from './pages/HomePage.jsx';
import MoviesPage from './pages/MoviesPage.jsx';
import FavoritePage from "./pages/FavoritePage.jsx";
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import MovieDetailPage from './pages/MovieDetailPage.jsx';
import ProtectedRoute from './components/ProtectedRoutes.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import DiscoverPage from './pages/DiscoverPage.jsx';
import WelcomePage from './pages/WelcomePage.jsx';

const router = createBrowserRouter([
  {
    element: <WelcomePage />,
    path: "/",
  },
  {
    element: <App />,
    children: [
      {
        element: <HomePage />,
        path: "/accueil",
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
        path: "/film_par_genre",
      },
      {
        element: <MoviesPage />,
        path: "/film_par_genre/:genre",
      },
      {
        element: <MovieDetailPage />,
        path: "/film/:id",
      },
      {
        element: <DiscoverPage />,
        path: "/film_par_annee",
      },
      {
        element: <DiscoverPage />,
        path: "/film_par_annee/:annee",
      },
      {
        element: (
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        ),
        path: "/admin",
      },
      {
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
        path: "/profil",
      },
      {
        element: (
          <ProtectedRoute>
            <FavoritePage />
          </ProtectedRoute>
        ),
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
