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
import Profile from './Pages/Profile'
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
    <div className="flex">
      <ToastContainer />
      <Navbar />
      <div className={`flex-1 w-full sm:ml-64 min-h-screen pt-20 sm:pt-0 transition-all duration-300 ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/listing' element={<Listings />} />
          <Route path='/about' element={<About />} />
          <Route path='/edit' element={<EditListing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/listing/:listId' element={<Listing />} />
          <Route path='/listing/:listId/edit' element={<EditListing />} />
          <Route path='/addNewPlace' element={<AddNewPlace />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </div>
    </div>
  );

}

export default App
