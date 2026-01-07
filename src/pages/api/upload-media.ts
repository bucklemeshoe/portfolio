import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse the incoming form data
  const uploadDir = path.join(process.cwd(), 'public', 'media');
  
  // Ensure the /public/media directory exists
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = new IncomingForm({
    uploadDir: uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  try {
    const [, files] = await form.parse(req);
    
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Use the original filename for the public path
    const filename = file.originalFilename?.replace(/\s+/g, '-') || file.newFilename;
    const destPath = path.join(uploadDir, filename);
    fs.renameSync(file.filepath, destPath);
    
    // Return the public path
    return res.status(200).json({ path: `/media/${filename}` });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Error parsing file' });
  }
}