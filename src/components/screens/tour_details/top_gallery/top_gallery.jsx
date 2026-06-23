import React, { useState } from 'react';
import styles from './top_gallery.module.scss';
import { Grid3x3GapFill } from 'react-bootstrap-icons';
import CustomContainer from '@/components/ui/custom_container/custom_container';

const TopGallery = ({ mainImage, images }) => {
  const handleScrollToGallery = () => {
    const el = document.getElementById('all-photos-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  // Ensure we have an array, filtering out any empty strings
  const sideImages = (images || []).filter(img => img).slice(0, 4);

  return (
    <>
      <div className={styles.galleryWrapper}>
        <CustomContainer>
          <div className={styles.gridContainer}>
            {/* Main large image */}
            <div 
              className={styles.mainImage} 
              style={{ backgroundImage: `url(${mainImage || '/tour.png'})` }}
              onClick={handleScrollToGallery}
            ></div>

            {images?.length > 0 && (
              <button className={styles.showAllBtn} onClick={handleScrollToGallery}>
                <Grid3x3GapFill className="me-2" />
                View all photos
              </button>
            )}
          </div>
        </CustomContainer>
      </div>
    </>
  );
};

export default TopGallery;
