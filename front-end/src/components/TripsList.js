import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const TripsList = () => {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);

  const fetchTrip = async () => {
    try {
      const response = await fetch('/api/trips');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTrips(data.trips);
    } catch (error) {
      console.error('Error fetching data: trips', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const userData = await fetch('/api/user/data');
      const data = await userData.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchTrip();
    fetchUserData();
  }, []);

  return (
    <div>
      <h2>Trips List</h2>
      <ul>
        {trips.map(trip => (
          <li key={trip._id}>
            <Link to={`/trip-details/${trip._id}`}>
              {trip.destination} - {new Date(trip.startDate).toLocaleDateString()} to {new Date(trip.endDate).toLocaleDateString()}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/add-trip">
        <button>Add New Trip</button>
      </Link>
      <Link to="/">
        <button>Back to Home</button>
      </Link>
    </div>
  );
};

export default TripsList;