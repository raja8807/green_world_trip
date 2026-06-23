import React, { useState } from 'react';
import CustomContainer from '@/components/ui/custom_container/custom_container';
import { Table, Button, Alert, Form, InputGroup } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import styles from './tours_list.module.scss';
import Link from 'next/link';
import { Trash, PencilSquare, Plus, Search } from 'react-bootstrap-icons';

const AdminToursList = ({ initialTours, error }) => {
  const router = useRouter();
  const [tours, setTours] = useState(initialTours || []);
  const [deleteError, setDeleteError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredTours = tours.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      t.name?.toLowerCase().includes(q) ||
      t.category_type?.toLowerCase().includes(q) ||
      t.state_country?.toLowerCase().includes(q);
      
    const matchesCategory = categoryFilter === '' || t.category_type === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

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

        <div className="mb-4 d-flex gap-3 flex-column flex-md-row">
          <InputGroup className="flex-grow-1">
            <InputGroup.Text className="bg-white">
              <Search />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search tours by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          
          <Form.Select 
            style={{ minWidth: '200px', width: 'auto' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
            <option value="honeymoon">Honeymoon</option>
          </Form.Select>
        </div>

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
              {filteredTours.length === 0 ? (
                <tr><td colSpan="5" className="text-center">No tours found.</td></tr>
              ) : (
                filteredTours.map(tour => (
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
