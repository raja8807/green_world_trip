import React, { useState } from "react";
import styles from "./contact.module.scss";
import { supabase } from "@/lib/supabaseClient";
import { Alert } from "react-bootstrap";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const { error } = await supabase.from('contact_messages').insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      }]);

      if (error) throw error;

      setStatus({ type: "success", message: "Thank you for your message! We will get back to you shortly." });
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      setTimeout(() => setStatus({ type: "", message: "" }), 5000);
    } catch (err) {
      setStatus({ type: "danger", message: "Failed to send message. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formCard} data-aos="fade-left" data-aos-delay="100">
      <h3>Send us a message</h3>
      <p>Fill out the form below and our team will get back to you within 24 hours.</p>
      
      {status.message && <Alert variant={status.type}>{status.message}</Alert>}
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
          />
        </div>


        <div className={styles.formGroup}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Tell us about your travel plans..."
          ></textarea>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
