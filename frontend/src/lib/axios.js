import axios from "axios";
export const axiosInstance=axios.create({
    baseURL:import.meta.env.MODE==="development"?"http://localhost:3000/api":"/api",
    withCredentials:true //for storing and sending cookies with request
})