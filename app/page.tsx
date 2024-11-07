'use client';
import type { NextPage } from 'next';
import { createClient } from '../supabaseClient';
import { useState, useEffect } from 'react';
import UploadFile from '../components/UploadFile';
import Image from 'next/image';

const bucket = {
  name: process.env.SUPABASE_BUCKET_NAME,
  url: process.env.SUPABASE_BUCKET_URL,
};

const HomePage: NextPage = () => {
  const supabase = createClient();
  const [images, setImages] = useState<FileObject[] | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      if (!bucket.name) {
        console.error('Bucket name no está definido');
        return;
      }

      try {
        const { data: imagesData } = await supabase.storage.from(bucket.name).list();
        if (imagesData) {
          setImages(imagesData);
        } else {
          setImages([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchImages();
  }, [bucket.name, supabase]);

  return (
    <div>
      <h1>Bienvenido a De Primera</h1>
      <UploadFile />
      <h2>Imágenes del bucket:</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {images?.map((image) => (
          <div key={image.name} style={{ margin: '10px' }}>
            <Image
              src={new URL(`${bucket.url}/product-images/${image.name}`)}
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
