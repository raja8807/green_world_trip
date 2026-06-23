import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

const DestinationsForm = ({ initialData }) => {
  const router = useRouter();
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      tours_text: '',
      image: '',
      href: '',
      is_large: false,
      sort_order: 0,
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
          .from('top_destinations')
          .update({
            title: formData.title,
            tours_text: formData.tours_text,
            image: formData.image,
            href: formData.href,
            is_large: formData.is_large,
            sort_order: parseInt(formData.sort_order),
          })
          .eq('id', initialData.id);

        if (updateError) throw updateError;
      } else {
        // Create
        const { error: insertError } = await supabase
          .from('top_destinations')
          .insert([
            {
              title: formData.title,
              tours_text: formData.tours_text,
              image: formData.image,
              href: formData.href,
              is_large: formData.is_large,
              sort_order: parseInt(formData.sort_order),
            },
          ]);

        if (insertError) throw insertError;
      }

      router.push('/admin/top-destinations');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm border">
      <h3 className="mb-4">{initialData ? 'Edit Destination' : 'Add New Destination'}</h3>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Kerala"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tours Text</Form.Label>
          <Form.Control
            type="text"
            name="tours_text"
            value={formData.tours_text}
            onChange={handleChange}
            required
            placeholder="e.g. 15 tours"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
            placeholder="https://..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Destination Link (href)</Form.Label>
          <Form.Control
            type="text"
            name="href"
            value={formData.href}
            onChange={handleChange}
            required
            placeholder="e.g. /domestic/Kerala"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Sort Order</Form.Label>
          <Form.Control
            type="number"
            name="sort_order"
            value={formData.sort_order}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Check
            type="checkbox"
            name="is_large"
            label="Is Large (Spans 2 columns)"
            checked={formData.is_large}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Destination'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default DestinationsForm;
