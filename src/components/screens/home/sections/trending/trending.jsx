import React from "react";
import styles from "./trending.module.scss";
import TourCard from "@/components/common/tour_card/tour_card";
import CustomContainer from "@/components/ui/custom_container/custom_container";
import { Col, Row } from "react-bootstrap";

const TrendingTours = () => {
  const tours = [
    {
      id: 1,
      title: "American Parks Trail end Rapid City",
      location: "Nevada, American",
      image: "/images/tour-1.jpg",
      profile: "/images/profile-1.jpg",
      featured: true,
      discount: "-11%",
      reviews: 7,
      rating: 4.5,
      duration: "8 hours",
      price: "₹0,00",
    },
    {
      id: 2,
      title: "Discover Beautiful Bali Beaches",
      location: "Bali, Indonesia",
      image: "/images/tour-2.jpg",
      profile: "/images/profile-2.jpg",
      featured: true,
      discount: "-15%",
      reviews: 12,
      rating: 5,
      duration: "5 days",
      price: "₹299",
    },
    {
      id: 3,
      title: "Dubai Desert Safari Adventure",
      location: "Dubai, UAE",
      image: "/images/tour-3.jpg",
      profile: "/images/profile-3.jpg",
      featured: false,
      discount: "-8%",
      reviews: 20,
      rating: 4,
      duration: "6 hours",
      price: "₹120",
    },
    {
      id: 4,
      title: "Swiss Alps Mountain Journey",
      location: "Switzerland",
      image: "/images/tour-4.jpg",
      profile: "/images/profile-4.jpg",
      featured: true,
      discount: "-20%",
      reviews: 15,
      rating: 4.5,
      duration: "3 days",
      price: "₹850",
    },
  ];

  return (
    <section className={styles.TrendingTours} data-aos="fade-up">
      <CustomContainer>
        <h2>Trending Tours</h2>
        <div className={styles.wrap}>
          <Row>
            {tours.map((tour) => {
              return (
                <Col key={tour.id} xs={12} md={6} lg={3}>
                  <TourCard tour={tour} />
                </Col>
              );
            })}
          </Row>
        </div>
      </CustomContainer>
    </section>
  );
};

export default TrendingTours;
