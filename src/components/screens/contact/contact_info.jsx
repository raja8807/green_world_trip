import React from "react";
import { TelephoneFill, EnvelopeFill, GeoAltFill, Whatsapp } from "react-bootstrap-icons";
import { CONTACT_DETAILS } from "@/constants/conatct";
import styles from "./contact.module.scss";

const ContactInfo = () => {
  return (
    <div className={styles.infoWrapper} data-aos="fade-right">
      <div className={styles.infoCard}>
        <div className={styles.iconWrapper}>
          <TelephoneFill />
        </div>
        <div className={styles.content}>
          <h4>Phone</h4>
          <a href={`tel:+${CONTACT_DETAILS.phone1.number}`}>
            {CONTACT_DETAILS.phone1.text}
          </a>
        </div>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.iconWrapper}>
          <Whatsapp />
        </div>
        <div className={styles.content}>
          <h4>WhatsApp</h4>
          <a
            href={`https://wa.me/${CONTACT_DETAILS.whatsapp1.number}?text=${CONTACT_DETAILS.whatsapp1.message}`}
            target="_blank"
            rel="noreferrer"
          >
            {CONTACT_DETAILS.whatsapp1.text}
          </a>
        </div>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.iconWrapper}>
          <EnvelopeFill />
        </div>
        <div className={styles.content}>
          <h4>Email</h4>
          {CONTACT_DETAILS.emails.map((email, index) => (
            <a key={index} href={`mailto:${email}`}>
              {email}
            </a>
          ))}
        </div>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.iconWrapper}>
          <GeoAltFill />
        </div>
        <div className={styles.content}>
          <h4>Office Address</h4>
          {CONTACT_DETAILS.address.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
