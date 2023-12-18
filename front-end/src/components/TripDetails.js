import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function TripDetails(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await fetch(`/api/trips/${id}`);
        if (response.ok) {
          const tripData = await response.json();
          setTrip(tripData.trip);
        } else {
          console.log('Failed to fetch trip details');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTripDetails();
  }, [id]);

  const handleUpdateTrip = async () => {
            navigate(`/update-trip/${id}`);
  };

  const handleDeleteTrip = async () => {
    const confirmation = window.confirm('Are you sure you want to delete this trip?');
    if (confirmation) {
      try {
        const response = await fetch(`/api/trips/${id}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          console.log('Trip deleted successfully');
          navigate('/');
        } else {
          console.log('Failed to delete trip');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div>
      <h2>Trip Details</h2>
      {trip && (
        <div>
          <p>Destination: {trip.destination}</p>
          <p>Start Date: {new Date(trip.startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(trip.endDate).toLocaleDateString()}</p>
          <p>Description: {trip.description}</p>
          <p>Budget: {trip.budget}</p>
          <p>Activities:{trip.activities}</p>
          <button onClick={handleUpdateTrip}>Update</button>
          <button onClick={handleDeleteTrip}>Delete</button>
          <br />
          <Link to="/trips">Back to Trips List</Link>
          
        </div>
      )}
    </div>
  );
};

export default TripDetails;