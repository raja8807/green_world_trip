import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import ToursScreen from '@/components/screens/tours/tours';

export default function DestinationToursPage({ tours, error, destination, category }) {
  // Format the destination name for display
  const formattedDestination = destination.replace(/-/g, ' ');
  return <ToursScreen tours={tours} error={error} category={formattedDestination} />;
}

export async function getServerSideProps({ params }) {
  const { category, destination } = params;

  if (category !== 'domestic' && category !== 'international') {
    return {
      notFound: true,
    };
  }

  // We use ilike in Supabase which is case-insensitive
  const searchDestination = destination.replace(/-/g, ' ');

  try {
    const { data: tours, error } = await supabase
      .from('tours')
      .select('*')
      .eq('category_type', category)
      .ilike('state_country', `%${searchDestination}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      props: {
        tours: tours || [],
        destination,
        category
      },
    };
  } catch (error) {
    console.error(`Error fetching ${category} tours by destination:`, error);
    return {
      props: {
        tours: [],
        error: error.message,
        destination,
        category
      },
    };
  }
}
