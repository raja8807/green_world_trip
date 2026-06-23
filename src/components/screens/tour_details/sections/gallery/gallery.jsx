import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { X, ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import styles from './gallery.module.scss';

const GallerySection = ({ images }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handleImageClick = (index) => {
    setSelectedIndex(index);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div id="all-photos-section" className={styles.gallerySection} data-aos="fade-up">
      <h2 className={styles.sectionTitle}>Gallery</h2>
      <hr className={styles.divider} />

      <div className={styles.imageGrid}>
        {images.map((img, index) => (
          <div key={index} className={styles.imageWrapper} onClick={() => handleImageClick(index)}>
            <img src={img} alt={`Gallery Image ${index + 1}`} className={styles.image} />
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleClose} centered size="xl" contentClassName={styles.modalContent}>
        <Modal.Body className={styles.modalBody}>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
            <X size={32} />
          </button>
          
          <button className={styles.navBtnPrev} onClick={handlePrev} aria-label="Previous">
            <ChevronLeft size={32} />
          </button>

          <img src={images[selectedIndex]} alt="Full Screen" className={styles.fullImage} />
          
          <button className={styles.navBtnNext} onClick={handleNext} aria-label="Next">
            <ChevronRight size={32} />
          </button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default GallerySection;
