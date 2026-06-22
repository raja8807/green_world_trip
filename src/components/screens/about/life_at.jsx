import React from "react";
import { Container } from "react-bootstrap";
import styles from "./life_at.module.scss";
import CustomButton from "@/components/ui/custom_button/custom_button";

const LifeAt = () => {
  return (
    <section className={styles.lifeAtSection}>
      <div className={styles.overlay}></div>
      <Container className={styles.content}>
        <h2 data-aos="fade-up">Life at Traveler</h2>
        <div data-aos="fade-up" data-aos-delay="150">
          <CustomButton variant={1}>Join our team</CustomButton>
        </div>
      </Container>
    </section>
  );
};

export default LifeAt;
