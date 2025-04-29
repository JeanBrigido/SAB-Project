export const validateEvent = (event) => {
  const trimmedEvent = {
    event_name: event.event_name.trim(),
    description: event.description.trim(),
    event_date: event.event_date,
    event_time: event.event_time,
    location: event.location.trim()
  };

  if (!trimmedEvent.event_name || !trimmedEvent.description || 
      !trimmedEvent.event_date || !trimmedEvent.event_time || !trimmedEvent.location) {
    throw new Error('All fields are required and cannot be empty');
  }

  return trimmedEvent;
};