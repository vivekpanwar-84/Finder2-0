import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import Listing from './Pages/Listing'
import Listings from './Pages/Listings'
import Login from './Pages/Login'
import EditListing from './Pages/Edit'
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from "./context/ThemeContext";
import AddNewPlace from './Pages/AddNewPlace'
import { useEffect, useState } from 'react'
import { AuthProvider } from './context/AuthContext';


const App = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

const MainApp = () => {
  const { isDark, toggleTheme } = useTheme();
  // Token is now managed in AuthContext, ensuring all components have access to the same state

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/listing' element={<Listings />} />
        <Route path='/about' element={<About />} />
        <Route path='/edit' element={<EditListing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/listing/:listId' element={<Listing />} />
        <Route path='/listing/:listId/edit' element={<EditListing />} />
        <Route path='/addNewPlace' element={<AddNewPlace />} />
      </Routes>
    </div>
  );

}

export default App
