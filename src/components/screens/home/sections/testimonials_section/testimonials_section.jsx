import React from "react";
import styles from "./testimonials_section.module.scss";

import { Image } from "react-bootstrap";

import { StarFill, Quote } from "react-bootstrap-icons";

import { Slide } from "react-slideshow-image";

import "react-slideshow-image/dist/styles.css";

import { supabase } from "@/lib/supabaseClient";

const chunkArray = (array, size) => {
  const result = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
};

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTestimonials(data || []);
      } catch (err) {
        console.error("Error fetching testimonials:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading || testimonials.length === 0) return null;

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
                    src={item.image || "/assets/avatar.png"}
                    alt={item.name}
                    roundedCircle
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
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
