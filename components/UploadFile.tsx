import { useState } from 'react';
import { createClient, bucket } from '../supabaseClient';

const UploadFile = () => {
  const supabase = createClient();
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    const { data, error } = await supabase.storage.from(bucket.name).upload(file.name, file);

    if (error) {
      console.error(error);
    } else {
      console.log(data);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Subir archivo</button>
    </div>
  );
};

export default UploadFile;
