import React from "react";
import { Container } from "react-bootstrap";
import SEO from "@/components/common/seo/seo";
import styles from "./privacy-policy.module.scss";

const PrivacyPolicyScreen = () => {
  return (
    <>
      <SEO title="Privacy Policy" description="Privacy Policy for Green World Trip." />
      <section className={styles.policySection}>
        <Container>
          <div className={styles.contentWrapper}>
            <h1 className={styles.pageTitle}>Privacy Policy</h1>
            <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
            <p>
              Green World Trip ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website greenworldtrip.com and use our services.
            </p>
            
            <h2>1. Information We Collect</h2>
            <p>
              We may collect personal identification information from you in a variety of ways, including, but not limited to, when you visit our site, register on the site, place an order, subscribe to the newsletter, and in connection with other activities, services, features, or resources we make available on our Site. You may be asked for, as appropriate, name, email address, mailing address, phone number, and payment information.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>
              We may use the information we collect from you to:
            </p>
            <ul>
              <li>Process and manage your bookings and payments securely.</li>
              <li>Improve customer service and respond to your requests.</li>
              <li>Personalize user experience and understand how our users as a group use the services provided on our Site.</li>
              <li>Send periodic emails regarding your order or other products and services.</li>
            </ul>

            <h2>3. Payment Information and Security</h2>
            <p>
              We do not store your credit card or payment information on our servers. All payment transactions are processed through secure, PCI-compliant third-party payment gateways. We adopt appropriate data collection, storage, processing practices, and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information and transaction data.
            </p>

            <h2>4. Sharing Your Personal Information</h2>
            <p>
              We do not sell, trade, or rent users' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers. We may also share information with third-party service providers (like airlines or hotels) necessary to fulfill your booking.
            </p>

            <h2>5. Changes to This Privacy Policy</h2>
            <p>
              Green World Trip has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the top of this page. We encourage users to frequently check this page for any changes.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
};

export default PrivacyPolicyScreen;
