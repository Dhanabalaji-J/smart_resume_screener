import axios from "axios";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`
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