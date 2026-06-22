import React, { useState } from "react";
import styles from "./tour_card.module.scss";

import { Image } from "react-bootstrap";

import {
  GeoAlt,
  Clock,
  HeartFill,
  LightningChargeFill,
} from "react-bootstrap-icons";
import Link from "next/link";

const TourCard = ({ tour }) => {
  const [liked, setLiked] = useState(false);

  // Safely extract the image url
  const imageUrl = tour.main_image || "/tour.png";

  return (
    <Link href={`/tours/${tour.slug}`}>
      <div className={styles.card}>
        {/* Image Section */}
        <div className={styles.imageWrapper}>
          <Image src={imageUrl} alt={tour.name} className={styles.image} fluid />

          {/* Optional Flags mapping */}
          {tour.flags?.is_featured && (
            <div className={styles.featured}>Featured</div>
          )}

          <button
            className={`${styles.favoriteBtn} ${liked ? styles.active : ""}`}
            onClick={(e) => {
              e.preventDefault(); // prevent routing when liking
              setLiked(!liked);
            }}
          >
            <HeartFill />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.location}>
            <GeoAlt />
            <span>{tour.location || tour.state_country}</span>
          </div>

          <h3>{tour.name}</h3>

          {/* Reviews removed per instructions */}

          <div className={styles.bottomRow}>
            <div className={styles.duration}>
              <Clock />
              <span>
                {tour.duration_days} Days / {tour.duration_nights} Nights
              </span>
            </div>

            {/* Price removed per instructions */}
            <div className={styles.price}>
              <small>
                <LightningChargeFill />
                Explore
              </small>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;
