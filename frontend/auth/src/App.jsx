import React from 'react';
import Login from './screens/Login';
import Home from './screens/Home';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Register from './screens/Register';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
