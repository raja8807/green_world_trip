import React from "react";
import CustomContainer from "@/components/ui/custom_container/custom_container";
import { Row, Col, Image } from "react-bootstrap";
import styles from "./tour_categories.module.scss";
import { TOUR_CATEGORIES } from "@/constants/constants";
import Link from "next/link";

const TourCategories = () => {
  return (
    <section className={styles.tourCategoriesSection}>
      <CustomContainer>
        <Row>
          {TOUR_CATEGORIES.map((category) => (
            <Col lg={category.colLg} md={category.colMd} key={category.id}>
              <Link href={category.href}>
                <div
                  className={styles.categoryCard}
                  data-aos="fade-up"
                  data-aos-delay={category.delay}
                >
                  <Image src={category.image} alt={category.title} />
                  <div className={styles.overlay}></div>
                  <div className={styles.content}>
                    <div className={styles.subtitle}>{category.subtitle}</div>
                    <h3>{category.title}</h3>
                    <p>{category.offer}</p>
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </CustomContainer>
    </section>
  );
};

export default TourCategories;
