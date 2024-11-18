import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TheaterList = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      const response = await axios.get('http://localhost:8080/restTemplate/getAllTheaters');
      setTheaters(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching theaters');
      setLoading(false);
    }
  };

  const handleViewMovies = (location, theaterName) => {
    navigate(`/bookmyshow/${encodeURIComponent(location)}/${encodeURIComponent(theaterName)}`);
  };
  

  if (loading) return <div className="text-center mt-5">Loading theaters...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <div>
      <h1 className="text-center my-4">Bookmyshow</h1>
      <div className="container">
        <h2 className="mb-4">Available Theaters</h2>
        <div className="row">
          {theaters.map((theater) => (
            <div key={theater.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{theater.name}</h5>
                  <p className="card-text">
                    <strong>Location:</strong> {theater.location}<br />
                    <strong>Available Seats:</strong> {theater.availableSeats}
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleViewMovies(theater.location, theater.name)}
                  >
                    View Movies
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TheaterList;