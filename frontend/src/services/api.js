import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

export const getCandidates = async () => {
    const response = await API.get("/candidates");
    return response.data;
};

export const getCandidateById = async (id) => {
    const response = await API.get(`/candidates/${id}`);
    return response.data;
};

export default API;