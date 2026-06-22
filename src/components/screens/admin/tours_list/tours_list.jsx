import React, { useState } from 'react';
import CustomContainer from '@/components/ui/custom_container/custom_container';
import { Table, Button, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import styles from './tours_list.module.scss';
import Link from 'next/link';
import { Trash, PencilSquare, Plus } from 'react-bootstrap-icons';

const AdminToursList = ({ initialTours, error }) => {
  const router = useRouter();
  const [tours, setTours] = useState(initialTours || []);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to delete the tour: ${name}?`)) {
      const { error } = await supabase.from('tours').delete().eq('id', id);
      if (error) {
        setDeleteError(error.message);
      } else {
        setTours(tours.filter(t => t.id !== id));
      }
    }
  };

  return (
    <div className={styles.adminPage}>
      <CustomContainer>
        <div className={styles.header}>
          <h2>Manage Tours</h2>
          <Link href="/admin/tours/new">
            <Button variant="primary" className={styles.addBtn}>
              <Plus /> Add New Tour
            </Button>
          </Link>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {deleteError && <Alert variant="danger">{deleteError}</Alert>}

        <div className={styles.tableWrapper}>
          <Table striped hover responsive className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.length === 0 ? (
                <tr><td colSpan="5" className="text-center">No tours found.</td></tr>
              ) : (
                tours.map(tour => (
                  <tr key={tour.id}>
                    <td>
                      <Link href={`/tours/${tour.slug}`} target="_blank" className={styles.tourLink}>
                        {tour.name}
                      </Link>
                    </td>
                    <td className="text-capitalize">{tour.category_type}</td>
                    <td>{tour.state_country}</td>
                    <td>{new Date(tour.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className={styles.actions}>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => router.push(`/admin/tours/${tour.id}`)}
                        >
                          <PencilSquare />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(tour.id, tour.name)}
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
      </CustomContainer>
    </div>
  );
};

export default AdminToursList;
