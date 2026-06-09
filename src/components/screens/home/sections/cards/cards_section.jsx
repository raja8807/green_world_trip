import React from "react";
import styles from "./cards_section.module.scss";

import { PersonBadge, GeoAlt, EmojiSmile } from "react-bootstrap-icons";
import CustomContainer from "@/components/ui/custom_container/custom_container";

const cards = [
  {
    id: 1,
    icon: <PersonBadge />,
    title: "1,000+ local guides",
    description: "Morbi semper fames lobortis ac hac penatibus",
  },
  {
    id: 2,
    icon: <GeoAlt />,
    title: "Handcrafted experiences",
    description: "Morbi semper fames lobortis ac hac penatibus",
  },
  {
    id: 3,
    icon: <PersonBadge />,
    title: "96% happy travelers",
    description: "Morbi semper fames lobortis ac hac penatibus",
  },
];

const CardsSection = () => {
  return (
    <section className={styles.CardsSection}>
      <CustomContainer className={styles.container}>
        <div className={styles.container}>
          {cards.map((card) => (
            <div className={styles.card} key={card.id} data-aos="fade-left">
              <div className={styles.icon}>{card.icon}</div>

              <div className={styles.content}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CustomContainer>
    </section>
  );
};

export default CardsSection;
