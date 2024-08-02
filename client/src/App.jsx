import React from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';

function App() {

  return (
    <section>
      <img className="absolute inset-0 z-0 h-[45vh] w-screen" src="../src/assets/gradient.png" />
      <div className="absolute inset-0 z-0 h-[45vh] bg-gradient-to-t from-[#0a0a0b] via-transparent"></div>
      <div className="absolute inset-0 z-0 h-[45vh] bg-gradient-to-r from-[#0a0a0b] via-transparent"></div>
      <NavBar />
      <Outlet />
      <Footer />
    </section>

  );
}

export default App;
