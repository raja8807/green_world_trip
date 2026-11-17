import React from "react";
import styles from "./banner.module.scss";
import SearchBar from "./search/search.module";
import FONTS from "@/styles/fonts";

const BannerSection = () => {
  return (
    <section className={styles.Banner}>
      <video autoPlay muted loop playsInline className={styles.video}>
        <source src="/assets/banner_bg.mp4" type="video/mp4" />
      </video>

      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <span className={styles.eyebrow} data-aos="fade-down">
          DISCOVER THE EXTRAORDINARY
        </span>
        <h1 className={FONTS.font2} data-aos="fade-up" data-aos-delay="100">
          Curated Luxury Journeys & Unforgettable Escapes
        </h1>
        <p data-aos="fade-up" data-aos-delay="200">
          Handcrafted domestic and international tours designed for discerning travelers.
        </p>
        <div className={styles.searchWrapper} data-aos="fade-up" data-aos-delay="300">
          <SearchBar />
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
