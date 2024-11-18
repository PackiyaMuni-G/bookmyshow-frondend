import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TheaterList from './component/TheaterList';
import MovieList from './component/MovieList';
import BookingConfirmation from './component/BookingConfirmation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TheaterList />} />
        <Route path="/bookmyshow/:location/:theaterName" element={<MovieList />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;