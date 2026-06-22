import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import PageBanner from "@/components/common/page_banner/page_banner";
import ContactInfo from "./contact_info";
import ContactForm from "./contact_form";
import styles from "./contact.module.scss";

const ContactScreen = () => {
  return (
    <>
      <PageBanner
        title="Contact Us"
        image="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
      />
      <section className={styles.contactSection}>
        <Container>
          <Row>
            <Col lg={4} md={12} className="mb-5 mb-lg-0">
              <ContactInfo />
            </Col>
            <Col lg={8} md={12}>
              <ContactForm />
            </Col>
          </Row>
        </Container>
      </section>
      
      <section className={styles.mapSection}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15610.160166258414!2d79.05581179354085!3d12.226879899999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baccf5a2a2bc0d5%3A0x6b6cc0f74bd2b6f1!2sTiruvannamalai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1716900000000!5m2!1sen!2sin"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Office Location Map"
        ></iframe>
      </section>
    </>
  );
};

export default ContactScreen;
