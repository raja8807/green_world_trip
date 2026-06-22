import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./team.module.scss";
import { LEADERSHIP_TEAM } from "@/constants/constants";

const Team = () => {
  return (
    <Container className={styles.teamSection}>
      <h2 data-aos="fade-up">Leadership Team</h2>
      <Row>
        {LEADERSHIP_TEAM.map((member, index) => (
          <Col lg={3} md={4} sm={6} xs={12} key={member.id}>
            <div
              className={styles.teamMember}
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <div className={styles.avatar}>
                {/* Using a generic placeholder for the avatar since the provided image is /assets/placeholder-avatar.jpg which might not exist */}
                <img
                  src={`https://i.pravatar.cc/150?img=${member.id + 10}`}
                  alt={member.name}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              </div>
              <h5>{member.name}</h5>
              <p>{member.role}</p>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Team;
