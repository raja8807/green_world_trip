import React, { useState } from 'react';
import styles from './reviews.module.scss';
import { StarFill, Star } from 'react-bootstrap-icons';

const ReviewsSection = ({ reviews, tourId }) => {
  const [showAll, setShowAll] = useState(false);

  if (!reviews || reviews.length === 0) {
    return (
      <div className={styles.reviewsSection} id="reviews">
        <h2 className={styles.sectionTitle}>Reviews</h2>
        <hr className={styles.divider} />
        <p className={styles.noReviews}>There are no reviews for this tour yet. Be the first to leave one!</p>
      </div>
    );
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  // Helper to render stars
  const renderStars = (rating) => {
    const num = Math.round(Number(rating));
    return (
      <div className={styles.stars}>
        {[...Array(5)].map((_, i) => (
          i < num ? <StarFill key={i} /> : <Star key={i} />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.reviewsSection} id="reviews">
      <h2 className={styles.sectionTitle}>Reviews ({reviews.length})</h2>
      <hr className={styles.divider} />

      <div className={styles.reviewsList}>
        {displayedReviews.map((review, idx) => (
          <div key={review.id || idx} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <div className={styles.avatar}>
                {review.reviewer_name.charAt(0).toUpperCase()}
              </div>
              <div className={styles.meta}>
                <span className={styles.name}>{review.reviewer_name}</span>
                <span className={styles.date}>
                  {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className={styles.ratingBox}>
                {renderStars(review.rating)}
              </div>
            </div>
            {review.review_text && (
              <p className={styles.reviewText}>{review.review_text}</p>
            )}
          </div>
        ))}
      </div>

      {reviews.length > 3 && (
        <button className={styles.loadMoreBtn} onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : 'Read All Reviews'}
        </button>
      )}
    </div>
  );
};

export default ReviewsSection;
