import React from "react";
import { Container } from "react-bootstrap";
import SEO from "@/components/common/seo/seo";
import styles from "./refund-policy.module.scss";

const RefundPolicyScreen = () => {
  return (
    <>
      <SEO title="Refund Policy" description="Refund Policy for Green World Trip." />
      <section className={styles.policySection}>
        <Container>
          <div className={styles.contentWrapper}>
            <h1 className={styles.pageTitle}>Refund and Cancellation Policy</h1>
            <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
            <p>
              Thank you for choosing Green World Trip. We understand that plans can change, and we strive to provide a fair cancellation and refund process for all our customers. Please read this policy carefully before booking.
            </p>
            
            <h2>1. Cancellation by the Customer</h2>
            <p>
              If you need to cancel your booking, you must notify us in writing via email at support@greenworldtrip.com. The cancellation date will be considered the date we receive your written notification.
            </p>
            <ul>
              <li><strong>30 days or more prior to departure:</strong> 90% refund of the total booking amount.</li>
              <li><strong>15 to 29 days prior to departure:</strong> 50% refund of the total booking amount.</li>
              <li><strong>7 to 14 days prior to departure:</strong> 25% refund of the total booking amount.</li>
              <li><strong>Less than 7 days prior to departure (or No-Show):</strong> No refund will be issued.</li>
            </ul>

            <h2>2. Non-Refundable Services</h2>
            <p>
              Certain services and bookings are strictly non-refundable regardless of the cancellation timeframe. These include:
            </p>
            <ul>
              <li>Flight tickets (subject to the specific airlin&apos;s policy).</li>
              <li>Visa processing fees and government taxes.</li>
              <li>Special promotional packages or discounted deals marked as non-refundable.</li>
              <li>Travel insurance premiums.</li>
            </ul>

            <h2>3. Cancellation by Green World Trip</h2>
            <p>
              We reserve the right to cancel any tour due to unforeseen circumstances, including but not limited to natural disasters, political instability, or insufficient minimum numbers. In such rare cases, you will be offered a full refund or the option to transfer your booking to an alternative date or tour. We are not responsible for any incidental expenses you may have incurred as a result of your booking (e.g., visas, non-refundable flights).
            </p>

            <h2>4. Refund Processing Time</h2>
            <p>
              Approved refunds will be processed and credited back to the original method of payment within 7 to 14 business days, depending on your bank or credit card issuer.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
};

export default RefundPolicyScreen;
