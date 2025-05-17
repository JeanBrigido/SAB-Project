export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  endpoints: {
    smallGroups: '/small-groups',
    events: '/events',
    // Add other endpoints as needed
  }
};