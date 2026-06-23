import React, { useState } from 'react';
import { Table, Badge, Form, Alert, Modal, Button } from 'react-bootstrap';
import { supabase } from '@/lib/supabaseClient';

export default function AdminContactMessagesPage({ initialMessages, error }) {
  const [messages, setMessages] = useState(initialMessages || []);
  const [statusError, setStatusError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setStatusError('');
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m));
    } catch (err) {
      setStatusError('Failed to update status: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new': return <Badge bg="danger">New</Badge>;
      case 'read': return <Badge bg="warning" text="dark">Read</Badge>;
      case 'replied': return <Badge bg="success">Replied</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Contact Messages</h2>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {statusError && <Alert variant="danger">{statusError}</Alert>}

      <div className="bg-white p-4 rounded shadow-sm border overflow-auto">
        <Table striped hover responsive className="align-middle">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Update Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr><td colSpan="6" className="text-center">No contact messages yet.</td></tr>
            ) : (
              messages.map(msg => (
                <tr key={msg.id}>
                  <td>{new Date(msg.created_at).toLocaleDateString()}</td>
                  <td className="fw-bold">{msg.name}</td>
                  <td><a href={`mailto:${msg.email}`}>{msg.email}</a></td>
                  <td>{getStatusBadge(msg.status)}</td>
                  <td>
                    <Form.Select 
                      size="sm" 
                      value={msg.status} 
                      onChange={(e) => handleStatusChange(msg.id, e.target.value)}
                      style={{ width: '130px' }}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm" onClick={() => setSelectedMessage(msg)}>
                      View Message
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Message Details Modal */}
      <Modal show={!!selectedMessage} onHide={() => setSelectedMessage(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Message Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMessage && (
            <div className="row g-3">
              <div className="col-md-6">
                <strong>Name:</strong> {selectedMessage.name}
              </div>
              <div className="col-md-6">
                <strong>Email:</strong> <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
              </div>
              <div className="col-md-6">
                <strong>Phone:</strong> {selectedMessage.phone ? <a href={`tel:${selectedMessage.phone}`}>{selectedMessage.phone}</a> : 'N/A'}
              </div>
              <div className="col-12 mt-4">
                <strong>Message:</strong>
                <div className="p-3 bg-light rounded mt-2 border" style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedMessage.message}
                </div>
              </div>
              <div className="col-12 mt-4 text-muted small">
                Submitted on: {new Date(selectedMessage.created_at).toLocaleString()}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedMessage(null)}>Close</Button>
          {selectedMessage && selectedMessage.status !== 'replied' && (
            <Button variant="primary" onClick={() => {
              handleStatusChange(selectedMessage.id, 'replied');
              setSelectedMessage(null);
            }}>
              Mark as Replied
            </Button>
          )}
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export async function getServerSideProps() {
  const { data: messages, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  return {
    props: {
      initialMessages: messages || [],
      error: error ? error.message : null,
    }
  };
}
