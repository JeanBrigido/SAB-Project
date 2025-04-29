import axios from 'axios';
import { useAuthContext } from '@asgardeo/auth-react';

const BASE_URL = "https://sab-cbaudvgcfab6g4gh.centralus-01.azurewebsites.net/events";

// Export functions directly
export const fetchEvents = async () => {
  try {
    console.log('Fetching events from:', BASE_URL);  // Debug log
    const response = await axios.get(BASE_URL);
    console.log('Events fetched:', response.data);  // Debug log
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    throw error;
  }
};

export const createEvent = async (eventData, token) => {
  try {
    const response = await axios.post(BASE_URL, eventData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (eventId, eventData, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/${eventId}`, eventData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Event not found');
    }
    console.error('Error updating event:', error);
    throw error;
  }
};