const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET = 'uploads';

module.exports = {

  uploadFiles: async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files provided');
      }

      const folder = req.body.folder || 'general';
      const urls = [];

      for (const file of req.files) {
        const ext = file.originalname.split('.').pop();
        const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(filename, file.buffer, {
            contentType: file.mimetype,
            upsert: false
          });

        if (error) {
          console.log('Supabase upload error:', error);
          return res.status(500).send('Upload failed: ' + error.message);
        }

        const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
        urls.push(data.publicUrl);
      }

      res.status(200).send({ urls });

    } catch (e) {
      console.log('Upload error:', e);
      res.status(500).send('Internal server error');
    }
  }

};
