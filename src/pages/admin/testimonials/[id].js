import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import TestimonialsForm from '@/components/screens/admin/testimonials_form/testimonials_form';
import { Alert } from 'react-bootstrap';

export default function EditTestimonialPage({ testimonial, error }) {
  if (error) {
    return <Alert variant="danger">Error loading testimonial: {error}</Alert>;
  }

  if (!testimonial) {
    return <Alert variant="warning">Testimonial not found.</Alert>;
  }

  return (
    <div>
      <TestimonialsForm initialData={testimonial} />
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single();

  return {
    props: {
      testimonial: data || null,
      error: error ? error.message : null,
    }
  };
}
