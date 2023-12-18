import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return ( 
    <nav>
      <ul>
          <Link to="/login">Login</Link>
          <br />
          <Link to="/register">Register</Link>
          <br />
          <Link to="/trips">Trips</Link>
          <br />
          <Link to="/add-trip">Add Trip</Link>
      </ul>
    </nav>
  );
};

export default Navigation;
