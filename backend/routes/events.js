app.get('/events', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*');
  
      if (error) {
        console.error('Error fetching events:', error);  // Log the error to understand what's going wrong
        throw error;
      }
      console.log('Fetched events:', data);  // Log the fetched events
      res.json(data);
    } catch (err) {
      console.error('Error:', err.message);  // Log any other errors
      res.status(500).json({ error: err.message });
    }
  });
  