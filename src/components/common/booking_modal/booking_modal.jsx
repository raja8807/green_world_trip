import React, { useState } from 'react';
import { Modal, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import styles from './booking_modal.module.scss';
import { CaretDownFill } from 'react-bootstrap-icons';
import { supabase } from '@/lib/supabaseClient';

const BookingModal = ({ show, setShow, tour }) => {
    const [formData, setFormData] = useState({
        customer_name: '',
        email: '',
        phone: '',
        travel_date: '',
        guests: '',
        special_requests: '',
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const { error } = await supabase.from('bookings').insert([{
                tour_id: tour?.id || null,
                tour_name: tour?.name || 'Unknown Tour',
                customer_name: formData.customer_name,
                email: formData.email,
                phone: formData.phone,
                travel_date: formData.travel_date,
                guests: parseInt(formData.guests),
                special_requests: formData.special_requests,
            }]);

            if (error) throw error;

            setStatus({ type: 'success', message: 'Booking request sent! We will confirm your details shortly.' });
            setFormData({
                customer_name: '', email: '', phone: '', travel_date: '', guests: '', special_requests: ''
            });
            
            setTimeout(() => {
                setShow(false);
                setStatus({ type: '', message: '' });
            }, 3000);
        } catch (error) {
            setStatus({ type: 'danger', message: 'Failed to send booking request. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={() => setShow(false)} centered className={styles.bookingModal} size="md">
            <Modal.Header closeButton className={styles.modalHeader}>
                <Modal.Title className={styles.modalTitle}>Book {tour?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                {status.message && <Alert variant={status.type}>{status.message}</Alert>}
                <Form onSubmit={handleSubmit}>
                    
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Tour</Form.Label>
                        <Form.Control type="text" readOnly disabled value={tour?.name || ''} className={styles.formControl} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} placeholder="Full Name *" required className={styles.formControl} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address *" required className={styles.formControl} />
                    </Form.Group>

                    <InputGroup className={`mb-3 ${styles.phoneInputGroup}`}>
                        <InputGroup.Text className={styles.flagAddon}>
                            <img src="https://flagcdn.com/w20/in.png" alt="India Flag" className={styles.flagIcon} />
                            <CaretDownFill className={styles.caretIcon} />
                        </InputGroup.Text>
                        <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number *" required className={styles.formControl} />
                    </InputGroup>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="travel_date"
                            value={formData.travel_date}
                            onChange={handleChange}
                            placeholder="Date of Travel *"
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => { if (!e.target.value) e.target.type = "text" }}
                            required
                            className={styles.formControl}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control 
                            type="number" 
                            name="guests"
                            value={formData.guests}
                            onChange={handleChange}
                            placeholder="No. of Guests *" 
                            min="1"
                            required 
                            className={styles.formControl} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Control 
                            as="textarea" 
                            rows={3}
                            name="special_requests"
                            value={formData.special_requests}
                            onChange={handleChange}
                            placeholder="Special Requests (Optional)" 
                            className={styles.formControl} 
                        />
                    </Form.Group>

                    <Button type="submit" disabled={loading} className={styles.submitBtn}>
                        {loading ? 'Processing...' : 'Request Booking'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default BookingModal;
