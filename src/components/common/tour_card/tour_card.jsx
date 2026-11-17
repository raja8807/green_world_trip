import React, { useState } from "react";
import styles from "./tour_card.module.scss";
import { Image } from "react-bootstrap";
import {
  GeoAlt,
  Clock,
  Heart,
  HeartFill,
  ArrowRight,
  Stars,
} from "react-bootstrap-icons";
import Link from "next/link";
import { getImageUrl } from "@/utils/image";
import FONTS from "@/styles/fonts";

const TourCard = ({ tour }) => {
  const [liked, setLiked] = useState(false);

  if (!tour) return null;

  // Safely extract the image url with R2 support
  const imageUrl = getImageUrl(tour.main_image) || "/tour.png";

  const durationText = tour.duration_days
    ? `${tour.duration_days} Days${tour.duration_nights ? ` / ${tour.duration_nights} Nights` : ""}`
    : null;

  const locationText =
    tour.location ||
    [tour.state_country, tour.region_continent].filter(Boolean).join(", ") ||
    "Global Destination";

  // Parse destinations array
  let destinationsList = [];
  if (Array.isArray(tour.destinations)) {
    destinationsList = tour.destinations;
  } else if (typeof tour.destinations === "string") {
    try {
      destinationsList = JSON.parse(tour.destinations);
    } catch {
      destinationsList = [tour.destinations];
    }
  }

  // Parse flags if string
  let flags = tour.flags || {};
  if (typeof flags === "string") {
    try {
      flags = JSON.parse(flags);
    } catch {
      flags = {};
    }
  }

  return (
    <Link href={`/tours/${tour.slug}`} className={styles.cardLink}>
      <article className={styles.card}>
        {/* Image Section */}
        <div className={styles.imageWrapper}>
          <Image
            src={imageUrl}
            alt={tour.name}
            className={styles.image}
            onError={(e) => {
              e.currentTarget.src = "/tour.png";
            }}
          />

          <div className={styles.gradientOverlay}></div>

          {/* Badges */}
          <div className={styles.badgesWrapper}>
            {flags.is_featured && (
              <span className={styles.featuredBadge}>
                <Stars size={11} className="me-1" /> Featured
              </span>
            )}
            {flags.is_trending && !flags.is_featured && (
              <span className={styles.trendingBadge}>Trending</span>
            )}
            {tour.category_type && (
              <span className={styles.categoryBadge}>
                {tour.category_type}
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            aria-label="Save to favorites"
            className={`${styles.favoriteBtn} ${liked ? styles.active : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLiked(!liked);
            }}
          >
            {liked ? <HeartFill size={15} /> : <Heart size={15} />}
          </button>
        </div>

        {/* Content Section */}
        <div className={styles.content}>
          <div className={styles.topMeta}>
            <div className={styles.location}>
              <GeoAlt className={styles.locIcon} size={13} />
              <span>{locationText}</span>
            </div>
            {durationText && (
              <div className={styles.durationPill}>
                <Clock size={12} className="me-1" />
                <span>{durationText}</span>
              </div>
            )}
          </div>

          <h3 className={`${styles.title} ${FONTS.font2}`}>
            {tour.name}
          </h3>

          {/* Destination tags */}
          {destinationsList.length > 0 && (
            <div className={styles.destinations}>
              {destinationsList.slice(0, 3).map((des, idx) => (
                <span key={idx} className={styles.destTag}>
                  {des}
                </span>
              ))}
              {destinationsList.length > 3 && (
                <span className={styles.destTagMore}>
                  +{destinationsList.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Bottom Action Row */}
          <div className={styles.bottomRow}>
            <div className={styles.priceContainer}>
              {tour.price ? (
                <>
                  <span className={styles.priceLabel}>From</span>
                  <span className={styles.priceValue}>₹{tour.price}</span>
                </>
              ) : (
                <span className={styles.customTripLabel}>Custom Package</span>
              )}
            </div>

            <div className={styles.viewDetailsCta}>
              <span>View Details</span>
              <ArrowRight className={styles.ctaArrow} size={14} />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default TourCard;
