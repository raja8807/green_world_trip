import React, { useState } from 'react';
import { Table, Badge, Form, Alert, Modal, Button } from 'react-bootstrap';
import { supabase } from '@/lib/supabaseClient';

export default function AdminEnquiriesPage({ initialEnquiries, error }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries || []);
  const [statusError, setStatusError] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setStatusError('');
      const { error } = await supabase
        .from('enquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: newStatus } : e));
    } catch (err) {
      setStatusError('Failed to update status: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new': return <Badge bg="danger">New</Badge>;
      case 'contacted': return <Badge bg="warning" text="dark">Contacted</Badge>;
      case 'resolved': return <Badge bg="success">Resolved</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Enquiries</h2>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {statusError && <Alert variant="danger">{statusError}</Alert>}

      <div className="bg-white p-4 rounded shadow-sm border overflow-auto">
        <Table striped hover responsive className="align-middle">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Destination</th>
              <th>Vacation</th>
              <th>Status</th>
              <th>Update Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 ? (
              <tr><td colSpan="7" className="text-center">No enquiries yet.</td></tr>
            ) : (
              enquiries.map(enq => (
                <tr key={enq.id}>
                  <td>{new Date(enq.created_at).toLocaleDateString()}</td>
                  <td className="fw-bold">{enq.name}</td>
                  <td>{enq.destination}</td>
                  <td className="text-capitalize">{enq.vacation_type}</td>
                  <td>{getStatusBadge(enq.status)}</td>
                  <td>
                    <Form.Select 
                      size="sm" 
                      value={enq.status} 
                      onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                      style={{ width: '130px' }}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="resolved">Resolved</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm" onClick={() => setSelectedEnquiry(enq)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Enquiry Details Modal */}
      <Modal show={!!selectedEnquiry} onHide={() => setSelectedEnquiry(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Enquiry Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEnquiry && (
            <div className="row g-3">
              <div className="col-md-6">
                <strong>Name:</strong> {selectedEnquiry.name}
              </div>
              <div className="col-md-6">
                <strong>Email:</strong> <a href={`mailto:${selectedEnquiry.email}`}>{selectedEnquiry.email}</a>
              </div>
              <div className="col-md-6">
                <strong>Phone:</strong> <a href={`tel:${selectedEnquiry.phone}`}>{selectedEnquiry.phone}</a>
              </div>
              <div className="col-md-6">
                <strong>City of Residence:</strong> {selectedEnquiry.city}
              </div>
              <div className="col-12 border-top my-3"></div>
              <div className="col-md-6">
                <strong>Destination:</strong> {selectedEnquiry.destination}
              </div>
              <div className="col-md-6">
                <strong>Date of Travel:</strong> {selectedEnquiry.travel_date}
              </div>
              <div className="col-md-6">
                <strong>No. of People:</strong> {selectedEnquiry.people_count}
              </div>
              <div className="col-md-6">
                <strong>Vacation Type:</strong> <span className="text-capitalize">{selectedEnquiry.vacation_type}</span>
              </div>
              <div className="col-12 mt-4 text-muted small">
                Submitted on: {new Date(selectedEnquiry.created_at).toLocaleString()}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

    </div>
  );
}

export async function getServerSideProps() {
  const { data: enquiries, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  return {
    props: {
      initialEnquiries: enquiries || [],
      error: error ? error.message : null,
    }
  };
}
