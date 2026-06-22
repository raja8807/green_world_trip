import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import TourForm from '@/components/screens/admin/tour_form/tour_form';

export default function EditTourPage({ tour, error }) {
  if (error || !tour) {
    return <div className="p-5 text-center"><h2>Error</h2><p>{error || 'Tour not found'}</p></div>;
  }
  return <TourForm initialData={tour} />;
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  const { data: tour, error } = await supabase
    .from('tours')
    .select('*, tour_itineraries(*)')
    .eq('id', id)
    .single();

  // Sort itineraries by day_number for the frontend
  if (tour && tour.tour_itineraries) {
    tour.tour_itineraries.sort((a, b) => a.day_number - b.day_number);
  }

  return {
    props: {
      tour: tour || null,
      error: error ? error.message : null,
    }
  };
}
