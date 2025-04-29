import { useAuthContext } from '@asgardeo/auth-react';
import axios from 'axios';

const BASE_URL = "https://sab-cbaudvgcfab6g4gh.centralus-01.azurewebsites.net/events";

export const createEvent = async (eventData) => {
  try {
    const { getAccessToken } = useAuthContext();
    const token = await getAccessToken();

    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await axios.post(BASE_URL, eventData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('Error creating event:', errorMessage);
    throw new Error(errorMessage);
  }
};