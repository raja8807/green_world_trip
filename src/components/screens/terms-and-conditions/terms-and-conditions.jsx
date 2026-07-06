import React from "react";
import { Container } from "react-bootstrap";
import SEO from "@/components/common/seo/seo";
import styles from "./terms-and-conditions.module.scss";

const TermsAndConditionsScreen = () => {
  return (
    <>
      <SEO title="Terms and Conditions" description="Terms and Conditions for Green World Trip." />
      <section className={styles.policySection}>
        <Container>
          <div className={styles.contentWrapper}>
            <h1 className={styles.pageTitle}>Terms and Conditions</h1>
            <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
            <p>
              Welcome to Green World Trip. These Terms and Conditions govern your use of our website (greenworldtrip.com) and our services. By accessing or using our services, you agree to be bound by these terms. If you do not agree with any part of these terms, you may not use our services.
            </p>

            <h2>1. Booking and Payments</h2>
            <p>
              All bookings made through Green World Trip are subject to availability. To secure a booking, you must provide accurate information and make the required payment. We use secure third-party payment gateways to process transactions. We do not store your credit card information on our servers.
            </p>

            <h2>2. Pricing</h2>
            <p>
              Prices listed on our website are subject to change without notice. Once a booking is confirmed and payment is received, the price of your tour is guaranteed, subject to any changes you make to your itinerary. Prices do not include personal expenses, optional activities, or gratuities unless explicitly stated.
            </p>

            <h2>3. User Responsibilities</h2>
            <p>
              You agree to provide true, accurate, current, and complete information when booking a tour. It is your responsibility to ensure you possess all necessary travel documents, such as passports and visas, required for your trip.
            </p>

            <h2>4. Cancellations and Refunds</h2>
            <p>
              Our cancellation and refund policies are detailed in our separate Refund Policy page. By agreeing to these Terms and Conditions, you also acknowledge and agree to our Refund Policy.
            </p>

            <h2>5. Limitation of Liability</h2>
            <p>
              Green World Trip acts only as an agent for the various independent suppliers that provide hotel accommodations, transportation, sightseeing activities, or other services connected with your tour. We are not liable for any negligent or willful act or failure to act of any such person or entity, or of any other third party.
            </p>

            <h2>6. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the website shall be subject to the exclusive jurisdiction of the courts in India.
            </p>

            <h2>7. Contact Us</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at support@greenworldtrip.com.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
};

export default TermsAndConditionsScreen;
