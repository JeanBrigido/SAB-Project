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

  app.post('/events', async (req, res) => {
    try {
      const { event_name, description, event_date, event_time, location } = req.body;
      
      // Validate required fields
      if (!event_name || !description || !event_date || !event_time || !location) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      console.log('Received event data:', req.body); // Add this line

      const { data, error } = await supabase
        .from('events')
        .insert([{ event_name, description, event_date, event_time, location }]);

      if (error) {
        console.error('Supabase error:', error); // Add this line
        return res.status(500).json({ error: error.message });
      }

      res.status(201).json(data);
    } catch (err) {
      console.error('Server error:', err); // Add this line
      res.status(500).json({ error: err.message });
    }
  });
