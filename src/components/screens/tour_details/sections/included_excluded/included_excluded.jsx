import React from 'react';
import styles from './included_excluded.module.scss';
import { Check, XLg } from 'react-bootstrap-icons';

const IncludedExcludedSection = ({ included = [], excluded = [] }) => {
  return (
    <div className={styles.incExcSection}>
      <h2 className={styles.sectionTitle}>Included/Excluded</h2>
      <hr className={styles.divider} />

      <div className={styles.grid}>
        <div className={styles.column}>
          <ul className={styles.list}>
            {included.map((item, idx) => (
              <li key={idx}>
                <Check className={styles.checkIcon} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.column}>
          <ul className={styles.list}>
            {excluded.map((item, idx) => (
              <li key={idx}>
                <XLg className={styles.crossIcon} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IncludedExcludedSection;
