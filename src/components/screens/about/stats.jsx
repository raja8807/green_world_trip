import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./stats.module.scss";
import { COMPANY_STATS } from "@/constants/constants";

const Stats = () => {
  return (
    <Container className={styles.statsSection}>
      <Row>
        {COMPANY_STATS.map((stat, index) => (
          <Col md={3} sm={6} xs={12} key={stat.id}>
            <div
              className={styles.statBox}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <h4>{stat.value}</h4>
              <p>{stat.label}</p>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Stats;
