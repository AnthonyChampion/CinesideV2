import React from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';

function App() {

  return (
    <div className="flex flex-col min-h-screen dark:bg-[#18181b] bg-white">
      <NavBar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
