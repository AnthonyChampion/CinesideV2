import { Outlet } from 'react-router-dom'
// import axios from "axios;"
import { useAuth } from './contexts/AuthContext'
import './App.css'
import NavBar from './components/NavBar'
import Footer from './components/Footer'


function App() {
  const { auth } = useAuth();
  // axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default App
