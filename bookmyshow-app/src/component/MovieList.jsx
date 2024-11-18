import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './MovieList.css'; // Ensure your styles are included

const MovieList = () => {
  const { location, theaterName } = useParams();
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null); // Track the selected movie for booking
  const navigate = useNavigate();

  // Fetch movies on component load
  useEffect(() => {
    fetch(`http://localhost:8080/restTemplate/${location}/${theaterName}`)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.runningMovies);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, [location, theaterName]);

  // Handle booking (trigger booking for one ticket)
  const handleBooking = (movieId) => {
    console.log("Booking button clicked for movie ID:", movieId); // Logging
    setSelectedMovie(movieId);  // Set the selected movie ID

    // API call to book one ticket
    fetch(
      `http://localhost:8080/restTemplate/bookTickets?theaterId=4&movieId=${movieId}&numberOfSeats=1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Booking successful:", data); // Logging
        navigate("/booking-confirmation", { state: { bookingConfirmation: data } });
      })
      .catch((error) => {
        console.error("Error booking tickets:", error); // Logging error
      });
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
              onClick={() => handleBooking(movie.id)} // Book 1 ticket
              className="btn btn-small"
            >
              Book Tickets
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
