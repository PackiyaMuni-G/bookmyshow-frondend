import React from "react";
import { useLocation } from "react-router-dom";

const BookingConfirmation = () => {
  const location = useLocation();
  const { bookingConfirmation } = location.state || {};

  if (!bookingConfirmation) {
    return <p>No booking information available.</p>;
  }

  return (
    <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
      <h2>Booking Confirmation</h2>
      <p>
        <strong>Movie:</strong> {bookingConfirmation.movie.title}
      </p>
      <p>
        <strong>Theater:</strong> {bookingConfirmation.theater.name}, {bookingConfirmation.theater.location}
      </p>
      <p>
        <strong>Seats Booked:</strong> {bookingConfirmation.numberOfSeats}
      </p>
      <p>
        <strong>Status:</strong> {bookingConfirmation.status}
      </p>
      <p>
        <strong>Booking Time:</strong> {new Date(bookingConfirmation.bookingTime).toLocaleString()}
      </p>
    </div>
  );
};

export default BookingConfirmation;
