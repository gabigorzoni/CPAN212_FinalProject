import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewTrip from './components/NewTrip';
import TripsList from './components/TripsList';
import TripDetails from './components/TripDetails';
import Login from './components/login';
import Register from './components/Register';
import UpdateTrip from './components/UpdateTrip';
import Home from './components/Home';



function App(){
  return (
    <Router>
      <div>
        <h1>Welcome to Trip Planner!</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-trip" element={<NewTrip />} />
          <Route path="/trip-details/:id" element={<TripDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/update-trip/:id" element={<UpdateTrip />} />
          <Route path="/trips" element={<TripsList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;