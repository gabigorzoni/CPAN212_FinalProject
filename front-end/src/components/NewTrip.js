import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateTrip = () => {
    const navigate = useNavigate();
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [activities, setActivities] = useState([]);

  const handleCreateTrip = async () => {
    const activitiesArray = activities.split(',').map(activity => activity.trim());
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            destination,
            startDate,
            endDate,
            description,
            budget,
            activities: activitiesArray,
        }),
      });

      if (response.ok) {
        console.log('Trip created successfully');
        navigate('/');
      } else {
        console.log('Failed to create trip');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
        <h2>Create a New Trip</h2>
        <br />
        <label>Destination: </label>
        <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            required
        />
        <br />
        <br />
        <label>Start Date: </label>
        <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
        />
        <br />
        <br />
        <label>End Date: </label>
        <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            required
        />
        <br />
        <br />
        <label>Description: </label>
        <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
        />
        <br />
        <br />
        <label>Budget: </label>
        <input
            type="number"
            placeholder="Budget"
            value={budget}
            onChange={e => setBudget(e.target.value)}
            required
        />
        <br />
        <br />
        <label>Activities: </label>
        <input
            type="text"
            placeholder="Activities"
            value={activities}
            onChange={e => setActivities(e.target.value)}
            required
        />
        <br />
        <br />
        <button onClick={handleCreateTrip}>Create Trip</button>
        <button onClick={() => navigate('/trips')}>Back to Trip List</button>
    </div>
  );
};

export default CreateTrip;
