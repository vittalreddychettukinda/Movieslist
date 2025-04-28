import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dash from './Header/Dash.js';
import Show from './Movieslist/Show.js';
import { Individual } from './Movieslist/Individual.js';
import { NewList } from './Movieslist/NewList.js';
import { EditList } from './Movieslist/EditList.js';
import { Lg } from './Login/Lg.js';
import { Signup } from './Login/Signup.js';
import { Navigate, useLocation } from 'react-router-dom';
import { Profile } from './Login/Profile.js';
import { ListIndividual } from './Movieslist/ListIndividual.js';
import { Payment } from './Movieslist/Payment.js';

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  const getSearchTermFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get('search') || '';
  };

  return (
    <>
      <Dash />

      <Routes>
        <Route path="/" element={<Navigate to="/listings" />} />
        
        <Route path="/listings" element={<Show />} />
        {/* Pass searchTerm dynamically from the URL query parameter */}
        <Route path="/listings" element={<ListIndividual searchTerm={getSearchTermFromQuery()} />} />

        <Route path="/listings/:id" element={<Individual />} />
        <Route path="/listings/new" element={<NewList />} />
        <Route path="/listings/:id/edit" element={<EditList />} />
        <Route path="/login" element={<Lg />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/payment' element={<Payment/>} />
      </Routes>
    </>
  );
}

export default App;
