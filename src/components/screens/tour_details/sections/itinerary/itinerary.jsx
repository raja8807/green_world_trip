import React, { useState } from 'react';
import { Accordion } from 'react-bootstrap';
import styles from './itinerary.module.scss';

const ItinerarySection = ({ itineraries }) => {
  const [expandAll, setExpandAll] = useState(false);
  // To handle expand all, we just set active keys to all IDs or null depending on expand state
  // For simplicity without complex state management on Accordion, we'll just toggle a boolean (React Bootstrap's Accordion uses activeKey state internally, so fully controlled expand all requires an array of keys)

  return (
    <div className={styles.itinerarySection}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Itinerary</h2>
        {/* <button className={styles.expandBtn}>Expand All</button> */}
      </div>

      <Accordion defaultActiveKey="0" className={styles.accordionGroup}>
        {itineraries.map((item, index) => (
          <Accordion.Item eventKey={index.toString()} key={item.id || index} className={styles.accordionItem}>
            <Accordion.Header className={styles.accordionHeader}>
              <span className={styles.dayHead}>{item.head}</span>
            </Accordion.Header>
            <Accordion.Body className={styles.accordionBody}>
              <div className={styles.bodyContent}>
                {item.images && item.images.length > 0 && (
                  <div className={styles.imageWrapper}>
                    <img src={item.images[0]} alt="Itinerary stop" />
                  </div>
                )}
                <div className={styles.textWrapper}>
                  <p>{item.text}</p>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default ItinerarySection;
