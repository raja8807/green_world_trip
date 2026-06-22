import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import TourDetailsScreen from '@/components/screens/tour_details/tour_details';

export default function TourPage({ tour, itineraries, faqs, reviews, error }) {
  if (error || !tour) {
    return (
      <div className="container py-5 text-center">
        <h2>Tour Not Found</h2>
        <p className="text-muted">{error || "The tour you are looking for does not exist."}</p>
      </div>
    );
  }

  return (
    <TourDetailsScreen 
      tour={tour} 
      itineraries={itineraries} 
      faqs={faqs} 
      reviews={reviews} 
    />
  );
}

export async function getServerSideProps({ params }) {
  const { slug } = params;

  try {
    // 1. Fetch the main tour
    const { data: tour, error: tourError } = await supabase
      .from('tours')
      .select('*')
      .eq('slug', slug)
      .single();

    if (tourError) throw tourError;

    // 2. Fetch related data using the tour's ID
    const [itinerariesRes, faqsRes, reviewsRes] = await Promise.all([
      supabase.from('tour_itineraries').select('*').eq('tour_id', tour.id).order('day_number', { ascending: true }),
      supabase.from('tour_faqs').select('*').eq('tour_id', tour.id),
      supabase.from('tour_reviews').select('*').eq('tour_id', tour.id).order('created_at', { ascending: false })
    ]);

    return {
      props: {
        tour: tour || null,
        itineraries: itinerariesRes.data || [],
        faqs: faqsRes.data || [],
        reviews: reviewsRes.data || [],
      },
    };
  } catch (error) {
    console.error("Error fetching tour details:", error);
    return {
      props: {
        error: error.message,
      },
    };
  }
}
