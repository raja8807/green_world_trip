import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

const TestimonialsForm = ({ initialData }) => {
  const router = useRouter();
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      image: '',
      review: '',
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (initialData?.id) {
        // Update
        const { error: updateError } = await supabase
          .from('testimonials')
          .update({
            name: formData.name,
            image: formData.image,
            review: formData.review,
          })
          .eq('id', initialData.id);

        if (updateError) throw updateError;
      } else {
        // Create
        const { error: insertError } = await supabase
          .from('testimonials')
          .insert([
            {
              name: formData.name,
              image: formData.image,
              review: formData.review,
            },
          ]);

        if (insertError) throw insertError;
      }

      router.push('/admin/testimonials');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm border">
      <h3 className="mb-4">{initialData ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Client Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. John Doe"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image URL (Optional)</Form.Label>
          <Form.Control
            type="text"
            name="image"
            value={formData.image || ''}
            onChange={handleChange}
            placeholder="Leave empty for default avatar, or paste a URL"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Review Text</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="review"
            value={formData.review}
            onChange={handleChange}
            required
            placeholder="Type the review here..."
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Testimonial'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default TestimonialsForm;
