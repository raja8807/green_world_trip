import React, { useState } from "react";
import styles from "./tour_card.module.scss";

import { Image } from "react-bootstrap";

import {
  GeoAlt,
  Clock,
  HeartFill,
  StarFill,
  StarHalf,
  Star,
  LightningChargeFill,
} from "react-bootstrap-icons";
import Link from "next/link";

const TourCard = ({tour}) => {
  const [liked, setLiked] = useState(false);

//   const tour = {
//     id: 4,
//     title: "Swiss Alps Mountain Journey",
//     location: "Switzerland",
//     image: "/images/tour-4.jpg",
//     profile: "/images/profile-4.jpg",
//     featured: true,
//     discount: "-20%",
//     reviews: 15,
//     rating: 4.5,
//     duration: "3 days",
//     price: "$850",
//   };

  return (
    <Link href={"/"}>
      <div className={styles.card}>
        {/* Image Section */}
        <div className={styles.imageWrapper}>
          <Image src="/tour.png" alt="Tour" className={styles.image} fluid />

          <div className={styles.featured}>Featured</div>

          {/* <div className={styles.discount}>-11%</div> */}

          <button
            className={`${styles.favoriteBtn} ${liked ? styles.active : ""}`}
            onClick={() => setLiked(!liked)}
          >
            <HeartFill />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.location}>
            <GeoAlt />
            <span>{tour.location}</span>
          </div>

          <h3>{tour.title}</h3>

          <div className={styles.reviewRow}>
            <div className={styles.stars}>
              <StarFill />
              <StarFill />
              <StarFill />
              <StarHalf />
              <Star />
            </div>

            <span>{tour.reviews} Reviews</span>
          </div>

          <div className={styles.bottomRow}>
            <div className={styles.duration}>
              <Clock />
              <span>{tour.duration}</span>
            </div>

            <div className={styles.price}>
              <small>
                <LightningChargeFill />
                from
              </small>

              <span>{tour.price}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;
