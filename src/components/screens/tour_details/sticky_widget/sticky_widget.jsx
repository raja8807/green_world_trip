import React, { useState } from 'react';
import styles from './sticky_widget.module.scss';
import BookingModal from '@/components/common/booking_modal/booking_modal';
import { LightningChargeFill, ShieldCheck, ClockHistory } from 'react-bootstrap-icons';

const StickyWidget = ({ tour }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className={styles.stickyWidget}>
        <div className={styles.priceContainer}>
          {/* We don't have price in schema, so we show a compelling CTA header */}
          <span className={styles.priceHeading}>Plan Your Dream Trip</span>
          <p className={styles.subText}>Contact our experts to customize this tour</p>
        </div>

        <button className={styles.enquireBtn} onClick={() => setShowModal(true)}>
          <LightningChargeFill className="me-2" />
          Book Now
        </button>

        <div className={styles.trustSignals}>
          <div className={styles.signal}>
            <ShieldCheck className={styles.icon} />
            <span>Secure Booking Guarantee</span>
          </div>
          <div className={styles.signal}>
            <ClockHistory className={styles.icon} />
            <span>24/7 Expert Support</span>
          </div>
        </div>
      </div>

      {/* Floating mobile booking bar */}
      <div className={styles.floatingMobileBar}>
        <div className={styles.mobilePriceInfo}>
          <span className={styles.mobileTitle}>{tour?.name}</span>
          <span className={styles.mobileSub}>Plan your trip</span>
        </div>
        <button className={styles.mobileBookBtn} onClick={() => setShowModal(true)}>
          Book Now
        </button>
      </div>

      <BookingModal show={showModal} setShow={setShowModal} tour={tour} />
    </>
  );
};

export default StickyWidget;
