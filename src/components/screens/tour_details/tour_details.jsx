import React from 'react';
import CustomContainer from '@/components/ui/custom_container/custom_container';
import OverviewSection from './sections/overview/overview';
import ItinerarySection from './sections/itinerary/itinerary';
import IncludedExcludedSection from './sections/included_excluded/included_excluded';
import FaqsSection from './sections/faqs/faqs';
import ReviewsSection from './sections/reviews/reviews';
import GallerySection from './sections/gallery/gallery';
import TopGallery from './top_gallery/top_gallery';
import StickyWidget from './sticky_widget/sticky_widget';
import styles from './tour_details.module.scss';

const TourDetailsScreen = ({ tour, itineraries, faqs, reviews }) => {

  
  

  return (
    <div className={styles.tourDetailsPage}>
      {/* Premium Hero Gallery Grid */}
      <TopGallery mainImage={tour.main_image} images={tour.images} />
      
      <CustomContainer>
        <div className={styles.twoColumnLayout}>
          
          <div className={styles.mainContent}>
            {/* Overview contains the Top Text content */}
            <OverviewSection tour={tour} reviews={reviews} />

            <div className={styles.contentWrapper}>
              {itineraries && itineraries.length > 0 && (
                <ItinerarySection itineraries={itineraries} />
              )}
              
              {(tour.included?.length > 0 || tour.excluded?.length > 0) && (
                <IncludedExcludedSection included={tour.included} excluded={tour.excluded} />
              )}
              
              {faqs && faqs.length > 0 && (
                <FaqsSection faqs={faqs} />
              )}

              {tour?.images && tour.images.length > 0 && (
                <GallerySection images={tour.images} />
              )}
              
              <ReviewsSection reviews={reviews} tourId={tour.id} />
            </div>
          </div>

          <div className={styles.sidebar}>
            <StickyWidget tour={tour} />
          </div>

        </div>
      </CustomContainer>
    </div>
  );
};

export default TourDetailsScreen;
