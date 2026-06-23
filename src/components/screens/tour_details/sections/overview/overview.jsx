import React from "react";
import styles from "./overview.module.scss";
import {
  GeoAlt,
  Clock,
  People,
  Translate,
  CursorFill,
} from "react-bootstrap-icons";

const OverviewSection = ({ tour, reviews }) => {
  // Calculate average rating
  const avgRating =
    reviews?.length > 0
      ? (
          reviews.reduce((acc, curr) => acc + Number(curr.rating), 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  const getDurarion = () => {
    let duration = "";
    if (tour.duration_days) {
      duration = `${tour.duration_days} Days`;
    }

    if (tour.duration_nights) {
      duration = duration + ` & ${tour.duration_nights} Nights`;
    }

    return duration
  };

  return (
    <section className={styles.overviewSection}>
      <div className={styles.contentContainer}>
        {/* Title Row */}
        <div className={styles.headerRow}>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>{tour.name}</h1>
            <div className={styles.location}>
              <GeoAlt className="me-2" />
              {tour.location ||
                `${tour.state_country}, ${tour.region_continent}`}
            </div>
          </div>

          <div className={styles.ratingArea}>
            {avgRating > 0 && (
              <>
                <div className={styles.ratingStars}>
                  <span className={styles.badge}>Very Good</span>
                  <div className={styles.stars}>
                    {"★".repeat(Math.round(avgRating))}
                    {"☆".repeat(5 - Math.round(avgRating))}
                  </div>
                </div>
                <a href="#reviews" className={styles.reviewCount}>
                  from {reviews.length} reviews
                </a>
              </>
            )}
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Quick Info Grid */}
        <div className={styles.quickInfoRow}>
          {getDurarion() && (
            <div className={styles.infoBox}>
              <Clock className={styles.icon} />
              <div>
                <span className={styles.label}>Duration</span>
                <span className={styles.value}>{getDurarion()}</span>
              </div>
            </div>
          )}
          <div className={styles.infoBox}>
            <CursorFill className={styles.icon} />
            <div>
              <span className={styles.label}>Tour Type</span>
              <span className={styles.value}>
                {tour.tour_type || "Daily Tour"}
              </span>
            </div>
          </div>

          <div className={styles.infoBox}>
            <People className={styles.icon} />
            <div>
              <span className={styles.label}>Group Size</span>
              <span className={styles.value}>
                {tour.group_size ? `${tour.group_size} people` : "Flexible"}
              </span>
            </div>
          </div>

          <div className={styles.infoBox}>
            <Translate className={styles.icon} />
            <div>
              <span className={styles.label}>Languages</span>
              <span className={styles.value}>English, Espanol</span>
            </div>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Overview Text */}
        <div className={styles.textSection}>
          <h2 className={styles.sectionTitle}>Overview</h2>
          <p className={styles.paragraph}>{tour.overview}</p>
        </div>

        {/* Highlights */}
        {tour.highlights && tour.highlights.length > 0 && (
          <div className={styles.textSection}>
            <h2 className={styles.sectionTitle}>Highlights</h2>
            <ul className={styles.highlightsList}>
              {tour.highlights.map((highlight, idx) => (
                <li key={idx}>
                  <span className={styles.circle}></span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default OverviewSection;
