import React from "react";
import styles from "./testimonials_section.module.scss";

import { Image } from "react-bootstrap";

import { StarFill, Quote } from "react-bootstrap-icons";

import { Slide } from "react-slideshow-image";

import "react-slideshow-image/dist/styles.css";

const testimonials = [
  {
    id: 1,
    name: "Eva Hicks",
    image: "/images/profile-1.jpg",
    review:
      "Faucibus tristique felis potenti ultrices ornare rhoncus semper hac facilisi Rutrum tellus lorem sem velit nisi non pharetra in dui.",
  },
  {
    id: 2,
    name: "Donald Wolf",
    image: "/images/profile-2.jpg",
    review:
      "Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum.",
  },
  {
    id: 3,
    name: "Charlie Harrington",
    image: "/images/profile-3.jpg",
    review:
      "Faucibus tristique felis potenti ultrices ornare rhoncus semper hac facilisi Rutrum tellus lorem sem velit nisi non pharetra in dui.",
  },
  {
    id: 4,
    name: "Sophia Carter",
    image: "/images/profile-4.jpg",
    review:
      "Amazing experience and professional guides. Everything was organized perfectly.",
  },
];

const chunkArray = (array, size) => {
  const result = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
};

const groupedTestimonials = chunkArray(testimonials, 3);

const TestimonialsSection = () => {
  return (
    <section className={styles.TestimonialsSection}>
      <div className={styles.container}>
        <h2>Our happy clients</h2>

        <Slide
          arrows={false}
          indicators={true}
          autoplay={true}
          duration={4000}
          transitionDuration={500}
          infinite={true}
          responsive={[
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ]}
        >
          {testimonials.map((item) => (
            <div className={styles.card} key={item.id}>
              <div className={styles.top}>
                <div className={styles.user}>
                  <Image
                    src={"/assets/avatar.png"}
                    alt={item.name}
                    roundedCircle
                  />

                  <div>
                    <h3>{item.name}</h3>

                    <div className={styles.stars}>
                      <StarFill />
                      <StarFill />
                      <StarFill />
                      <StarFill />
                      <StarFill />
                    </div>
                  </div>
                </div>

                <Quote className={styles.quote} />
              </div>

              <p>{item.review}</p>
            </div>
          ))}
        </Slide>
      </div>
    </section>
  );
};

export default TestimonialsSection;
