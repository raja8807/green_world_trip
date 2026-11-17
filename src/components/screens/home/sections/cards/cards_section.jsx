import React from "react";
import styles from "./cards_section.module.scss";
import { CompassFill, ShieldCheck, Headset } from "react-bootstrap-icons";
import CustomContainer from "@/components/ui/custom_container/custom_container";

const cards = [
  {
    id: 1,
    icon: <CompassFill />,
    title: "Handcrafted Itineraries",
    description: "Bespoke journeys uniquely tailored to your travel passions and utmost comfort.",
  },
  {
    id: 2,
    icon: <ShieldCheck />,
    title: "Verified Premium Stays",
    description: "Hand-selected luxury accommodations and certified five-star local destination guides.",
  },
  {
    id: 3,
    icon: <Headset />,
    title: "24/7 Dedicated Concierge",
    description: "Seamless personal assistance from departure to arrival and every step along the way.",
  },
];

const CardsSection = () => {
  return (
    <section className={styles.CardsSection}>
      <CustomContainer>
        <div className={styles.container}>
          {cards.map((card, idx) => (
            <div 
              className={styles.card} 
              key={card.id} 
              data-aos="fade-up" 
              data-aos-delay={idx * 150}
            >
              <div className={styles.iconWrapper}>
                {card.icon}
              </div>
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
