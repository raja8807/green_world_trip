import React, { useState } from 'react';
import { Table, Badge, Form, Alert, Modal, Button } from 'react-bootstrap';
import { supabase } from '@/lib/supabaseClient';

export default function AdminBookingsPage({ initialBookings, error }) {
  const [bookings, setBookings] = useState(initialBookings || []);
  const [statusError, setStatusError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setStatusError('');
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (err) {
      setStatusError('Failed to update status: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <Badge bg="warning" text="dark">Pending</Badge>;
      case 'confirmed': return <Badge bg="success">Confirmed</Badge>;
      case 'cancelled': return <Badge bg="danger">Cancelled</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Tour Bookings</h2>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {statusError && <Alert variant="danger">{statusError}</Alert>}

      <div className="bg-white p-4 rounded shadow-sm border overflow-auto">
        <Table striped hover responsive className="align-middle">
          <thead>
            <tr>
              <th>Date Received</th>
              <th>Customer</th>
              <th>Tour Name</th>
              <th>Travel Date</th>
              <th>Guests</th>
              <th>Status</th>
              <th>Update Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan="8" className="text-center">No bookings yet.</td></tr>
            ) : (
              bookings.map(booking => (
                <tr key={booking.id}>
                  <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                  <td className="fw-bold">{booking.customer_name}</td>
                  <td className="text-primary">{booking.tour_name}</td>
                  <td>{booking.travel_date}</td>
                  <td>{booking.guests}</td>
                  <td>{getStatusBadge(booking.status)}</td>
                  <td>
                    <Form.Select 
                      size="sm" 
                      value={booking.status} 
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      style={{ width: '130px' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm" onClick={() => setSelectedBooking(booking)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Booking Details Modal */}
      <Modal show={!!selectedBooking} onHide={() => setSelectedBooking(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <div className="row g-3">
              <div className="col-12 mb-2">
                <h4 className="text-primary border-bottom pb-2">{selectedBooking.tour_name}</h4>
              </div>
              <div className="col-md-6">
                <strong>Customer Name:</strong> {selectedBooking.customer_name}
              </div>
              <div className="col-md-6">
                <strong>Email:</strong> <a href={`mailto:${selectedBooking.email}`}>{selectedBooking.email}</a>
              </div>
              <div className="col-md-6">
                <strong>Phone:</strong> <a href={`tel:${selectedBooking.phone}`}>{selectedBooking.phone}</a>
              </div>
              <div className="col-12 border-top my-3"></div>
              <div className="col-md-6">
                <strong>Travel Date:</strong> {selectedBooking.travel_date}
              </div>
              <div className="col-md-6">
                <strong>Number of Guests:</strong> {selectedBooking.guests}
              </div>
              <div className="col-12 mt-3">
                <strong>Special Requests:</strong>
                <div className="p-3 bg-light rounded mt-2 border" style={{ whiteSpace: 'pre-wrap', minHeight: '80px' }}>
                  {selectedBooking.special_requests || <em className="text-muted">None provided.</em>}
                </div>
              </div>
              <div className="col-12 mt-4 text-muted small d-flex justify-content-between">
                <span>Submitted on: {new Date(selectedBooking.created_at).toLocaleString()}</span>
                <span>Current Status: {getStatusBadge(selectedBooking.status)}</span>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedBooking(null)}>Close</Button>
          {selectedBooking && selectedBooking.status === 'pending' && (
            <Button variant="success" onClick={() => {
              handleStatusChange(selectedBooking.id, 'confirmed');
              setSelectedBooking(null);
            }}>
              Mark as Confirmed
            </Button>
          )}
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export async function getServerSideProps() {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  return {
    props: {
      initialBookings: bookings || [],
      error: error ? error.message : null,
    }
  };
}
