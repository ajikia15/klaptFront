import { useEffect, useState } from 'react';
import { LaptopCard } from './LaptopCard';

async function fetchLaptop(id: number) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/laptops/${id}`,
    { credentials: 'include' },
  );
  if (!response.ok) throw new Error('Failed to fetch laptop');
  return response.json();
}

export default function QuickCompare() {
  const [laptops, setLaptops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    Promise.all([fetchLaptop(1), fetchLaptop(2)])
      .then((results) => setLaptops(results))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      {isLoading ? (
        <div className="col-span-full text-center text-neutral-400">
          Loading...
        </div>
      ) : error ? (
        <div className="col-span-full text-center text-red-500">
          Error loading laptops: {error}
        </div>
      ) : laptops && laptops.length > 0 ? (
        laptops.map((laptop) => (
          <LaptopCard key={laptop.id} isAuthenticated={false} {...laptop} />
        ))
      ) : (
        <div className="col-span-full text-center text-neutral-400">
          No laptops to compare
        </div>
      )}
    </div>
  );
}
