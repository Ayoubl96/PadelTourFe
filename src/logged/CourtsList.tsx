// components/CourtList.tsx

import React, { useState } from 'react';

interface Court {
  name: string;
  images: string[];
}

interface CourtListProps {
  fields: Court[];
}

const CourtItem: React.FC<Court> = ({ name, images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  return (
    <div className="my-6 rounded-lg border bg-white p-4 shadow-md">
      <h2 className="mb-4 text-2xl font-semibold">{name}</h2>
      <div className="relative">
        <img
          src={images[currentImageIndex]}
          alt={`Image ${currentImageIndex + 1} of ${name}`}
          className="h-64 w-full rounded-lg object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-800 bg-opacity-75 p-2 text-white transition hover:bg-gray-900"
            >
              ◀
            </button>
            <button
              onClick={nextImage}
              // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-800 bg-opacity-75 p-2 text-white transition hover:bg-gray-900"
            >
              ▶
            </button>
          </>
        )}
      </div>
      <div className="mt-4 flex justify-center space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`size-3 cursor-pointer rounded-full ${
              index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-400'
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

const CourtList: React.FC<CourtListProps> = ({ fields }) => {
  return (
    <div className="container mx-auto px-4">
      {fields.map((field, index) => (
        <CourtItem key={index} name={field.name} images={field.images} />
      ))}
    </div>
  );
};

export default CourtList;
