import React from "react";
import { Container } from "react-bootstrap";
import styles from "./founder_quote.module.scss";

const FounderQuote = () => {
  return (
    <Container>
      <div className={styles.quoteSection} data-aos="fade-up">
        <p className={styles.quoteText}>
          "Aenean sollicitudin, erat a elementum rutrum, neque sem pretium
          metus, quis mollis molestie et massa. Nam dapibus nisl vitae elit
          fringilla rutrum."
        </p>
        <div className={styles.authorInfo}>
          <div className={styles.avatar}>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
              alt="John Doe"
            />
          </div>
          <p className={styles.name}>John Doe</p>
          <p className={styles.role}>Founder</p>
        </div>
      </div>
    </Container>
  );
};

export default FounderQuote;
