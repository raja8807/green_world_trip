import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import DestinationsForm from '@/components/screens/admin/destinations_form/destinations_form';
import { Alert } from 'react-bootstrap';

export default function EditTopDestinationPage({ destination, error }) {
  if (error) {
    return <Alert variant="danger">Error loading destination: {error}</Alert>;
  }

  if (!destination) {
    return <Alert variant="warning">Destination not found.</Alert>;
  }

  return (
    <div>
      <DestinationsForm initialData={destination} />
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  const { data, error } = await supabase
    .from('top_destinations')
    .select('*')
    .eq('id', id)
    .single();

  return {
    props: {
      destination: data || null,
      error: error ? error.message : null,
    }
  };
}
