import React, { useState } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Trash, PencilSquare, Plus } from 'react-bootstrap-icons';
import Image from 'next/image';

export default function AdminTopDestinationsPage({ initialDestinations, error }) {
  const router = useRouter();
  const [destinations, setDestinations] = useState(initialDestinations || []);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async (id, title) => {
    if (confirm(`Are you sure you want to delete the destination: ${title}?`)) {
      const { error } = await supabase.from('top_destinations').delete().eq('id', id);
      if (error) {
        setDeleteError(error.message);
      } else {
        setDestinations(destinations.filter(d => d.id !== id));
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Top Destinations</h2>
        <Link href="/admin/top-destinations/new">
          <Button variant="primary">
            <Plus /> Add Destination
          </Button>
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {deleteError && <Alert variant="danger">{deleteError}</Alert>}

      <div className="bg-white p-4 rounded shadow-sm border overflow-auto">
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>Order</th>
              <th>Image</th>
              <th>Title</th>
              <th>Tours Text</th>
              <th>Link (href)</th>
              <th>Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations.length === 0 ? (
              <tr><td colSpan="7" className="text-center">No destinations found.</td></tr>
            ) : (
              destinations.map(dest => (
                <tr key={dest.id} className="align-middle">
                  <td>{dest.sort_order}</td>
                  <td>
                    <img 
                      src={dest.image} 
                      alt={dest.title} 
                      style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                  </td>
                  <td className="fw-bold">{dest.title}</td>
                  <td>{dest.tours_text}</td>
                  <td>{dest.href}</td>
                  <td>{dest.is_large ? 'Large' : 'Normal'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => router.push(`/admin/top-destinations/${dest.id}`)}
                      >
                        <PencilSquare />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(dest.id, dest.title)}
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
  const { data: destinations, error } = await supabase
    .from('top_destinations')
    .select('*')
    .order('sort_order', { ascending: true });

  return {
    props: {
      initialDestinations: destinations || [],
      error: error ? error.message : null,
    }
  };
}
