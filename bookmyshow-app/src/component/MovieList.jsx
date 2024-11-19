import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import './MovieList.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const MovieList = () => {
  const { location, theaterName } = useParams();
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [theaterInfo, setTheaterInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First fetch theater details
        const theatersResponse = await axios.get('http://localhost:8080/restTemplate/getAllTheaters');
        const theaters = theatersResponse.data;
        
        // Find the matching theater based on location and name
        const theater = theaters.find(
          (t) => t.location === location && t.name === theaterName
        );
        
        if (!theater) {
          throw new Error('Theater not found');
        }
        
        setTheaterInfo(theater);
        
        // Then fetch movies for this theater
        const moviesResponse = await axios.get(
          `http://localhost:8080/restTemplate/${location}/${theaterName}`
        );
        setMovies(moviesResponse.data.runningMovies);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [location, theaterName]);

  const handleBookingClick = (movie) => {
    setSelectedMovie(movie);
    setShowTicketModal(true);
    setTicketCount(1);
  };

  const handleConfirmBooking = async () => {
    if (!selectedMovie || !theaterInfo || isBooking) return;

    try {
      setIsBooking(true);
      const response = await axios.post(
        `http://localhost:8080/restTemplate/bookTickets`,
        null,
        {
          params: {
            theaterId: theaterInfo.id,
            movieId: selectedMovie.id,
            numberOfSeats: ticketCount
          }
        }
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setShowTicketModal(false);
      navigate("/booking-confirmation", { 
        state: { 
          bookingConfirmation: {
            ...response.data,
            numberOfSeats: ticketCount,
            theater: theaterInfo
          } 
        } 
      });
    } catch (error) {
      console.error("Error booking tickets:", error.message);
      alert(error.message || "Failed to book tickets. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const decrementTickets = (e) => {
    e.preventDefault();
    if (ticketCount > 1) {
      setTicketCount(prevCount => prevCount - 1);
    }
  };

  const incrementTickets = (e) => {
    e.preventDefault();
    if (ticketCount < 10) {
      setTicketCount(prevCount => prevCount + 1);
    }
  };

  return (
    <div className="movie-list-container">
      <h1>{theaterName} - Running Movies</h1>
      {movies.length === 0 && <p>No movies available.</p>}
      
      <div className="movie-cards-container">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p>Genre: {movie.genre}</p>
            </div>
            <button
              onClick={() => handleBookingClick(movie)}
              className="btn btn-primary btn-sm"
            >
              Book Tickets
            </button>
          </div>
        ))}
      </div>

      {showTicketModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Number of Tickets</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowTicketModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body text-center">
                <p className="mb-4">Selected Movie: {selectedMovie?.title}</p>
                <p className="mb-4">Theater: {theaterInfo?.name}</p>
                <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={decrementTickets}
                    disabled={ticketCount <= 1 || isBooking}
                    style={{ width: '40px', height: '40px', padding: '0' }}
                  >
                    -
                  </button>
                  <span className="fs-4 mx-3">{ticketCount}</span>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={incrementTickets}
                    disabled={ticketCount >= 10 || isBooking}
                    style={{ width: '40px', height: '40px', padding: '0' }}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="modal-footer justify-content-center">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowTicketModal(false)}
                  disabled={isBooking}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleConfirmBooking}
                  disabled={isBooking}
                >
                  {isBooking ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieList;