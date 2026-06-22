import React from "react";
import { Container } from "react-bootstrap";
import styles from "./newsletter.module.scss";
import { EnvelopeOpen } from "react-bootstrap-icons";
import CustomButton from "@/components/ui/custom_button/custom_button";

const Newsletter = () => {
  return (
    <div className={styles.newsletterSection}>
      <Container>
        <div className={styles.wrapper} data-aos="fade-up">
          <div className={styles.info}>
            <div className={styles.icon}>
              <EnvelopeOpen />
            </div>
            <div>
              <h4>Get Updates & More</h4>
              <p>Thoughtful thoughts to your inbox</p>
            </div>
          </div>
          <div className={styles.form}>
            <input type="email" placeholder="Your Email" />
            <CustomButton variant={1}>Subscribe</CustomButton>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Newsletter;
