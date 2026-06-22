import React from "react";
import PageBanner from "@/components/common/page_banner/page_banner";
import styles from "./about.module.scss";

import StoryMission from "./story_mission";
import Stats from "./stats";
import FounderQuote from "./founder_quote";
import LifeAt from "./life_at";
import Team from "./team";
import Newsletter from "./newsletter";

const AboutScreen = () => {
  return (
    <div className={styles.aboutScreen}>
      <PageBanner
        title="About Us"
        image="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80"
      />
      
      <div className={styles.sectionSpacing}>
        <StoryMission />
      </div>
      
      <div className={styles.sectionSpacing} style={{ backgroundColor: "#fff" }}>
        <Stats />
      </div>

      <div className={styles.sectionSpacing}>
        <FounderQuote />
      </div>

      <LifeAt />

      <div className={styles.sectionSpacing} style={{ backgroundColor: "#fff" }}>
        <Team />
      </div>

      <div className={styles.sectionSpacing}>
        <Newsletter />
      </div>
    </div>
  );
};

export default AboutScreen;
