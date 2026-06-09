import React from "react";
import styles from "./banner.module.scss";
import SearchBar from "./search/search.module";

const BannerSection = () => {
  return (
    <section className={styles.Banner}>
      <video autoPlay muted loop playsInline className={styles.video}>
        <source src="/assets/banner_bg.mp4" type="video/mp4" />
      </video>

      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <h1 data-aos="fade-left">Love where you&apos;re going</h1>
        <p data-aos="fade-right">
          Book incredible things to do around the world.
        </p>
        <br />
        <br />
        <SearchBar />
      </div>
    </section>
  );
};

export default BannerSection;
