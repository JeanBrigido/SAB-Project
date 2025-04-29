export const getAuthToken = () => {
  const sessionData = sessionStorage.getItem('session_data-instance_0-wUKMSl0DpGFLPQJyEMoTx5CfdG4a');
  if (!sessionData) {
    return null;
  }
  
  try {
    const { access_token } = JSON.parse(sessionData);
    return access_token;
  } catch (error) {
    console.error('Error parsing session data:', error);
    return null;
  }
};