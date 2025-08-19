import { useState, useEffect } from 'react';
import { getUniversities } from '../services/university-service';
import { University } from '../services/university-service';

const useUniversities = () => {
  const [data, setData] = useState<University[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const universities = await getUniversities();
        setData(universities);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  return { data, loading, error };
};

export default useUniversities;

