import React, { useState, useEffect } from 'react';

const UpdateTrip = ({ match }) => {
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await fetch(`/api/trips/${match.params.id}`);
        if (response.ok) {
          const tripData = await response.json();
          const { destination, startDate, endDate } = tripData.trip;
          setDestination(destination);
          setStartDate(startDate);
          setEndDate(endDate);
        } else {
          console.log('Failed to fetch trip details');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTripDetails();
  }, [match.params.id]);

  const handleUpdateTrip = async () => {
    try {
      const response = await fetch(`/api/trips/${match.params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destination, startDate, endDate, description, budget, activities }),
      });

      if (response.ok) {
        console.log('Trip updated successfully');
      } else {
        console.log('Failed to update trip');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
        <h2>Update Trip Details</h2>
        <br />
        <label>Destination: </label>
        <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={e => setDestination(e.target.value)}
        />
        <br />
        <br />
        <label>Start Date: </label>
        <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
        />
        <br />
        <br />
        <label>End Date: </label>
        <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
        />
        <br />
        <br />
        <label>Description: </label>
        <input 
            type="text"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
        />
        <br />
        <br />
        <label>Budget: </label>
        <input
            type="number"
            placeholder="Budget"
            value={budget}
            onChange={e => setBudget(e.target.value)}
        />
        <br />
        <br />
        <label>Activities: </label>
        <input
            type="text"
            placeholder="Activities"
            value={activities}
            onChange={e => setActivities(e.target.value)}
        />

        <button onClick={handleUpdateTrip}>Update Trip</button>
    </div>
  );
};

export default UpdateTrip;