import axios from "axios";

// ----------------- BASE URL -----------------
// Update this to your Azure backend URL
const API = "http://localhost:5000/api";

// ----------------- BOOKINGS API -----------------
export const createBooking = (data) =>
  axios.post(`${API}/bookings`, data);

export const getBookings = () =>
  axios.get(`${API}/bookings`);

export const cancelBooking = (id) =>
  axios.delete(`${API}/bookings/${id}`);

export const updateBooking = (id, data) =>
  axios.patch(`${API}/bookings/${id}`, data);

// ----------------- TABLES API -----------------
export const getTables = () =>
  axios.get(`${API}/tables`);

export const addTable = (number, capacity) =>
  axios.post(`${API}/tables`, { number, capacity });

export const deleteTable = (number) =>
  axios.delete(`${API}/tables/${number}`);

// ----------------- FLOOR PLAN API -----------------
export const getFloorPlanLayout = () => {
  console.log("Fetching floor plan layout from:", `${API}/floorplan/layout`);
  return axios.get(`${API}/floorplan/layout`);
};

export const saveFloorPlanLayout = (layout) => {
  console.log("Saving floor plan layout to:", `${API}/floorplan/layout`, layout);
  return axios.post(`${API}/floorplan/layout`, layout);
};
