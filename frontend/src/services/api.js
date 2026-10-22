
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    console.error(
        "VITE_API_URL is missing. Check your frontend/.env file."
    );
}

const API = axios.create({
    baseURL: `${API_URL}/api`,
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
