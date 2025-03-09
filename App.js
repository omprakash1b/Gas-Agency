import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './login'
import CylinderBooking from './booking';
import BookingHistory from './bookinghistory';
import MyBookingHistory from './mybookinghistory'
import AdminDashboard from './admin';
import ManageBookings from './managebooking';
import UserRegistration from './registration';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element = {<Login />} />
        <Route path='/cylinder-booking' element = {<CylinderBooking />} />
        <Route path='/mybooking-history' element = {<MyBookingHistory />} />
        <Route path='/admin' element = {<AdminDashboard />} />
        <Route path='/manage-bookings' element = {<ManageBookings />} />
        <Route path='/user-registration' element = {<UserRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;
