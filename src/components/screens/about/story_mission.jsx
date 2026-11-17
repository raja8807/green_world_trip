import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import styles from "./story_mission.module.scss";
import Logo from "@/components/common/logo/logo";

const StoryMission = () => {
  return (
    <Container className={styles.storyMissionSection}>
      <Row className="mb-5 justify-content-center">
        <Col lg={12}>
          <div className={styles.introBlock} data-aos="fade-up">
            <Row className="align-items-start">
              <Col md={5} className={styles.introLeft}>
             
                <Logo />
                
                <br/>
                <br/>
                <p className={styles.introSubtitle}>
                  Our Agency is in a class of its own. A full service agency, both
                  leisure and corporate travel, with many specialty areas.
                </p>
                <div className={styles.accentLine}></div>
              </Col>
              <Col md={7} className={styles.introRight}>
                <h4 className="mb-3">About Us</h4>
                <p>
                  With the foresight to seize the opportunities in the domestic travel
                  market, brought on by a slew of new airlines, We offered travellers
                  the convenience of online travel bookings at rock-bottom prices.
                  Rapidly, Our company became the preferred choice of millions of
                  travellers who were delighted to be empowered by a few mouse clicks!
                </p>
                <p>
                  Our company rise has been lead by the vision and the spirit of each
                  one of its employees, for whom no idea was too big and no problem
                  too difficult. With untiring innovation and determination, Our
                  company proactively began to diversify its product offering, adding
                  a variety of online and offline products and services.
                </p>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <div className={styles.block} data-aos="fade-up">
            <div className={styles.imageWrapper}>
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Our Story"
              />
            </div>
            <h3>Our Story</h3>
            <p>
              Founded with a deep passion for exploration, Green World Trip was born out of a desire to make premium travel effortless, enriching, and deeply personal. From the serene backwaters of Kerala to the snow-clad peaks of the Himalayas and vibrant global horizons, we connect travelers with the authentic heart of each destination.
            </p>
          </div>
        </Col>
        <Col md={6}>
          <div className={styles.block} data-aos="fade-up" data-aos-delay="100">
            <div className={styles.imageWrapper}>
              <Image
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Our mission"
              />
            </div>
            <h3>Our Mission</h3>
            <p>
              Our mission is to craft transformative travel experiences celebrating natural beauty and cultural wonder. We combine meticulous itinerary planning with hand-selected boutique stays, verified local experts, and 24/7 dedicated support—ensuring each journey is completely seamless and unforgettable.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default StoryMission;
