import React, { useEffect, useState } from "react";
import styles from "./featured.module.scss";
import TourCard from "@/components/common/tour_card/tour_card";
import CustomContainer from "@/components/ui/custom_container/custom_container";
import SectionHeading from "@/components/common/section_heading/section_heading";
import { Col, Row } from "react-bootstrap";
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
          .contains('flags', { is_featured: true })
          .limit(4);

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
            <Row className="g-4">
              {tours.map((tour) => {
                return (
                  <Col key={tour.id} xs={12} sm={6} lg={3}>
                    <TourCard tour={tour} />
                  </Col>
                );
              })}
            </Row>
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
