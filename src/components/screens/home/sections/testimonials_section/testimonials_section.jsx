import React from "react";
import styles from "./testimonials_section.module.scss";
import { Image } from "react-bootstrap";
import { StarFill, Quote } from "react-bootstrap-icons";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { supabase } from "@/lib/supabaseClient";
import { getImageUrl } from "@/utils/image";
import SectionHeading from "@/components/common/section_heading/section_heading";
import CustomContainer from "@/components/ui/custom_container/custom_container";

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
    <section className={styles.TestimonialsSection} data-aos="fade-up">
      <CustomContainer>
        <SectionHeading 
          subtitle="VOICES OF WONDER"
          title="Stories From Our Travelers"
          text="Read genuine reflections from adventurers who discovered the world with our personal care."
        />

        <div className={styles.sliderContainer}>
          <Slide
            arrows={false}
            indicators={true}
            autoplay={true}
            duration={4500}
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
              <div className={styles.slideItem} key={item.id}>
                <div className={styles.card}>
                  <div className={styles.top}>
                    <div className={styles.user}>
                      <Image
                        src={getImageUrl(item.image) || "/assets/avatar.png"}
                        alt={item.name}
                        roundedCircle
                        className={styles.avatar}
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

                  <p className={styles.reviewText}>&ldquo;{item.review}&rdquo;</p>
                </div>
              </div>
            ))}
          </Slide>
        </div>
      </CustomContainer>
    </section>
  );
};

export default TestimonialsSection;
