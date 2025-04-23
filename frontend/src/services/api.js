import axios from 'axios';

// services/api.js or wherever you make fetch calls
const BASE_URL = "https://your-azure-backend-url.azurewebsites.net";

//const API_URL = 'http://localhost:3000';

export const getEvents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/events`);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(`${BASE_URL}/events`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};