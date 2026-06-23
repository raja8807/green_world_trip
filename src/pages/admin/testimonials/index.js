import React, { useState } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Trash, PencilSquare, Plus } from 'react-bootstrap-icons';

export default function AdminTestimonialsPage({ initialTestimonials, error }) {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState(initialTestimonials || []);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to delete the testimonial from: ${name}?`)) {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) {
        setDeleteError(error.message);
      } else {
        setTestimonials(testimonials.filter(t => t.id !== id));
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Testimonials</h2>
        <Link href="/admin/testimonials/new">
          <Button variant="primary">
            <Plus /> Add Testimonial
          </Button>
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {deleteError && <Alert variant="danger">{deleteError}</Alert>}

      <div className="bg-white p-4 rounded shadow-sm border overflow-auto">
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Review Snippet</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.length === 0 ? (
              <tr><td colSpan="5" className="text-center">No testimonials found.</td></tr>
            ) : (
              testimonials.map(item => (
                <tr key={item.id} className="align-middle">
                  <td className="fw-bold">{item.name}</td>
                  <td>
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }} 
                      />
                    ) : (
                      <span className="text-muted">Default</span>
                    )}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: '300px' }}>
                    {item.review}
                  </td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => router.push(`/admin/testimonials/${item.id}`)}
                      >
                        <PencilSquare />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(item.id, item.name)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const { data: testimonials, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  return {
    props: {
      initialTestimonials: testimonials || [],
      error: error ? error.message : null,
    }
  };
}
