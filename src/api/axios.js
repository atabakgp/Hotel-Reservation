import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://5f6d939160cf97001641b049.mockapi.io/tkn/",
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);

const getHotels = () => axiosInstance.get("hotels");
const getHotelDetails = () => axiosInstance.get("hotel-details");
const getCoupons = (code) => axiosInstance.get("coupons?code=" + code);
const submitReservation = (payload) =>
  axiosInstance.post("hotel-bookings", payload);

const updateReservation = (payload, id) =>
  axiosInstance.put("hotel-bookings/" + id, payload);

const deleteReservation = (id) => axiosInstance.delete("hotel-bookings/" + id);

export default {
  getHotels,
  getHotelDetails,
  getCoupons,
  submitReservation,
  updateReservation,
  deleteReservation,
};
