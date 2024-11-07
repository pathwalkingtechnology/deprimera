'use client';
import type { NextPage } from 'next';
import { createClient, bucket } from '../supabaseClient';
import { useState, useEffect } from 'react';
import UploadFile from '../components/UploadFile';
import Image from 'next/image';

const HomePage: NextPage = () => {
  const supabase = createClient();

  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const { data: imagesData } = await supabase.storage.from(bucket.name).list();
      setImages(imagesData);
    };
    fetchImages();
  }, [supabase]);

  return (
    <div>
      <h1>Bienvenido a De Primera</h1>
      <UploadFile />
      <h2>Imágenes del bucket:</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {images.map((image) => (
          <div key={image.name} style={{ margin: '10px' }}>
            <Image
              src={`${bucket.url}/${image.name}`}
              width={200}
              height={200}
              alt={image.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
