import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSupabaseQuery<T>(
  tableName: string, 
  orderByField: string = 'created_at', 
  ascending: boolean = true
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order(orderByField, { ascending });

      if (error) {
        console.error(`Error fetching table ${tableName}:`, error);
        setError(error);
      } else {
        setData(data as T[]);
      }
      setLoading(false);
    };

    fetchData();

    // Set up real-time subscription
    const channel = supabase
      .channel(`public:${tableName}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, orderByField, ascending]);

  return { data, loading, error };
}
