import axios from 'axios';

const BASE_URL = "https://sab-cbaudvgcfab6g4gh.centralus-01.azurewebsites.net/events";

export const fetchEvents = async () => {
  try {
    console.log('Fetching events from:', BASE_URL);
    const response = await axios.get(BASE_URL);
    console.log('Events fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
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
  if (!eventId || !eventData || !token) {
    console.error('Missing required parameters:', { eventId, hasData: !!eventData, hasToken: !!token });
    throw new Error('Missing required parameters for update');
  }

  try {
    // Validate event data before sending
    const validatedData = {
      event_name: eventData.event_name,
      description: eventData.description,
      event_date: eventData.event_date,
      event_time: eventData.event_time,
      location: eventData.location
    };

    console.log('Making update request:', {
      url: `${BASE_URL}/${eventId}`,
      data: validatedData
    });

    const response = await axios.put(
      `${BASE_URL}/${eventId}`, 
      validatedData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

export const deleteEvent = async (eventId, token) => {
  try {
    await axios.delete(`${BASE_URL}/${eventId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};