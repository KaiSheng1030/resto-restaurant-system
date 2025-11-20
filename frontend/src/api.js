import axios from "axios";
const API_URL = "http://localhost:5000/api/bookings";

export const createBooking = (data) => axios.post(API_URL, data);
export const getBookings = () => axios.get(API_URL);
export const cancelBooking = (id) => axios.delete(`${API_URL}/${id}`);
export const updateBooking = (id, data) =>
  axios.patch(`${API_URL}/${id}`, data);
