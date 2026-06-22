import React from 'react';
import { Accordion } from 'react-bootstrap';
import styles from './faqs.module.scss';
import { QuestionCircle } from 'react-bootstrap-icons';

const FaqsSection = ({ faqs }) => {
  return (
    <div className={styles.faqsSection}>
      <h2 className={styles.sectionTitle}>FAQs</h2>
      <hr className={styles.divider} />

      <Accordion className={styles.accordionGroup}>
        {faqs.map((faq, index) => (
          <Accordion.Item eventKey={index.toString()} key={faq.id || index} className={styles.accordionItem}>
            <Accordion.Header className={styles.accordionHeader}>
              <div className={styles.headContent}>
                <QuestionCircle className={styles.qIcon} />
                <span className={styles.questionText}>{faq.question}</span>
              </div>
            </Accordion.Header>
            <Accordion.Body className={styles.accordionBody}>
              <p>{faq.answer}</p>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default FaqsSection;
