import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import AdminToursList from '@/components/screens/admin/tours_list/tours_list';

export default function AdminToursPage({ tours, error }) {
  return <AdminToursList initialTours={tours} error={error} />;
}

export async function getServerSideProps() {
  const { data: tours, error } = await supabase
    .from('tours')
    .select('id, name, slug, category_type, state_country, created_at')
    .order('created_at', { ascending: false });

  return {
    props: {
      tours: tours || [],
      error: error ? error.message : null,
    }
  };
}
