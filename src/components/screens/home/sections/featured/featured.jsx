import React, { useEffect, useState } from "react";
import styles from "./featured.module.scss";
import TourCard from "@/components/common/tour_card/tour_card";
import CustomContainer from "@/components/ui/custom_container/custom_container";
import SectionHeading from "@/components/common/section_heading/section_heading";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { supabase } from "@/lib/supabaseClient";

const FeaturedTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        const { data, error } = await supabase
          .from("tours")
          .select("*")
          .contains("flags", { is_featured: true })
          .limit(9);

        if (error) throw error;
        
        setTours(data || []);
      } catch (error) {
        console.error("Error fetching featured tours:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTours();
  }, []);

  return (
    <section className={styles.FeaturedTours} data-aos="fade-up">
      <CustomContainer>
        <SectionHeading 
          subtitle="SIGNATURE EXPERIENCES"
          title="Featured Expeditions"
          text="Immerse yourself in exceptional itineraries with hand-selected luxury stays and guides."
          viewAllLink="/international"
          viewAllText="View All Expeditions"
        />
        <div className={styles.wrap}>
          {loading ? (
             <div className={styles.loadingWrapper}>
               <p className="text-muted">Loading featured tours...</p>
             </div>
          ) : tours && tours.length > 0 ? (
            <div className={styles.sliderWrapper}>
              <Slide
                slidesToShow={1}
                slidesToScroll={1}
                infinite={tours.length > 3}
                indicators={false}
                autoplay={true}
                duration={4200}
                transitionDuration={600}
                pauseOnHover={true}
                canSwipe={true}
                prevArrow={
                  <button className={`${styles.arrowBtn} ${styles.prevArrow}`} aria-label="Previous tour">
                    <ChevronLeft size={18} />
                  </button>
                }
                nextArrow={
                  <button className={`${styles.arrowBtn} ${styles.nextArrow}`} aria-label="Next tour">
                    <ChevronRight size={18} />
                  </button>
                }
                responsive={[
                  {
                    breakpoint: 992,
                    settings: {
                      slidesToShow: 3,
                      slidesToScroll: 1,
                    },
                  },
                  {
                    breakpoint: 640,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1,
                    },
                  },
                ]}
              >
                {tours.map((tour) => (
                  <div key={tour.id} className={styles.slideItem}>
                    <TourCard tour={tour} />
                  </div>
                ))}
              </Slide>
            </div>
          ) : (
             <div className={styles.emptyState}>
               <p className="text-muted">No featured tours available right now.</p>
             </div>
          )}
        </div>
      </CustomContainer>
    </section>
  );
};

export default FeaturedTours;
