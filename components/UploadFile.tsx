import { useState } from 'react';
import { createClient } from '../supabaseClient';

const bucket = {
  name: process.env.SUPABASE_BUCKET_NAME,
};

const UploadFile = () => {
  const supabase = createClient();
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) {
      console.error('No se ha seleccionado un archivo');
      return;
    }
    if (!bucket.name) {
      console.error('Bucket name no está definido');
      return;
    }

    const { data, error } = await supabase.storage.from(bucket.name).upload(file.name, file);

    if (error) {
      console.error(error);
    } else {
      console.log(data);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    } else {
      console.error('No se ha seleccionado un archivo');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir archivo</button>
    </div>
  );
};

export default UploadFile;
