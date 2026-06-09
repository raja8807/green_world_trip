import React from "react";
import styles from "./destinations_section.module.scss";
import { Image } from "react-bootstrap";

const destinations = [
  {
    id: 1,
    title: "New York",
    tours: "20 tours",
    image: "/assets/newyork.jpg",
    large: true,
  },
  {
    id: 2,
    title: "California",
    tours: "20 tours",
    image: "/assets/newyork.jpg",
  },
  {
    id: 3,
    title: "San Francisco",
    tours: "20 tours",
    image: "/assets/newyork.jpg",
  },
  {
    id: 4,
    title: "New Jersey",
    tours: "20 tours",
    image: "/assets/newyork.jpg",
  },
  {
    id: 5,
    title: "Nevada",
    tours: "20 tours",
    image: "/assets/newyork.jpg",
  },
];

const DestinationsSection = () => {
  return (
    <section className={styles.DestinationsSection}>
      <div className={styles.container}>
        <h2>Top Destinations</h2>

        <div className={styles.grid}>
          {destinations.map((item) => (
            <div
              key={item.id}
              className={`${styles.card} ${
                item.large ? styles.large : ""
              }`}
            >
              <Image
                src={item.image}
                alt={item.title}
                className={styles.image}
              />

              <div className={styles.overlay}></div>

              <div className={styles.content}>
                <h3>{item.title}</h3>

                <button>{item.tours}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;