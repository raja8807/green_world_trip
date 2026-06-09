import React from "react";
import styles from "./section_heading.module.scss";
import FONTS from "@/styles/fonts";

const SectionHeading = ({ title, head, variation = 1 }) => {
  return (
    <div className={`${styles.SectionHeading} ${styles[`v${variation}`]}`}>
      <p data-aos="fade-down">{title}</p>
      <h2 className={FONTS.font2} data-aos="fade-up">
        {head}
      </h2>
    </div>
  );
};

export default SectionHeading;
