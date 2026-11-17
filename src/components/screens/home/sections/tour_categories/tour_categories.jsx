import React from "react";
import CustomContainer from "@/components/ui/custom_container/custom_container";
import { Row, Col, Image } from "react-bootstrap";
import styles from "./tour_categories.module.scss";
import { TOUR_CATEGORIES } from "@/constants/constants";
import Link from "next/link";
import { getImageUrl } from "@/utils/image";
import FONTS from "@/styles/fonts";
import { ArrowRight } from "react-bootstrap-icons";

const TourCategories = () => {
  return (
    <section className={styles.tourCategoriesSection}>
      <CustomContainer>
        <Row>
          {TOUR_CATEGORIES.map((category) => (
            <Col lg={category.colLg} md={category.colMd} key={category.id}>
              <Link href={category.href} className={styles.cardLink}>
                <div
                  className={styles.categoryCard}
                  data-aos="fade-up"
                  data-aos-delay={category.delay}
                >
                  <Image src={getImageUrl(category.image)} alt={category.title} />
                  <div className={styles.overlay}></div>
                  <div className={styles.content}>
                    <span className={styles.subtitle}>{category.subtitle}</span>
                    <h3 className={FONTS.font2}>{category.title}</h3>
                    <p>{category.offer}</p>
                    <span className={styles.exploreLink}>
                      Explore Collection <ArrowRight />
                    </span>
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
