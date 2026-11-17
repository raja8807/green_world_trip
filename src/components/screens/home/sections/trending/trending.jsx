import React, { useEffect, useState } from "react";
import styles from "./trending.module.scss";
import TourCard from "@/components/common/tour_card/tour_card";
import CustomContainer from "@/components/ui/custom_container/custom_container";
import SectionHeading from "@/components/common/section_heading/section_heading";
import { Col, Row } from "react-bootstrap";
import { supabase } from "@/lib/supabaseClient";

const TrendingTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingTours = async () => {
      try {
        const { data, error } = await supabase
          .from("tours")
          .select("*")
          .contains('flags', { is_trending: true })
          .limit(4);

        if (error) throw error;
        
        if (!data || data.length === 0) {
           const { data: featuredData, error: featuredError } = await supabase
             .from("tours")
             .select("*")
             .contains('flags', { is_featured: true })
             .limit(4);
           
           if (!featuredError) setTours(featuredData || []);
        } else {
           setTours(data);
        }
      } catch (error) {
        console.error("Error fetching trending tours:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTours();
  }, []);

  return (
    <section className={styles.TrendingTours} data-aos="fade-up">
      <CustomContainer>
        <SectionHeading 
          subtitle="POPULAR RIGHT NOW"
          title="Trending Journeys"
          text="Discover the most sought-after itineraries loved by our travelers this season."
          viewAllLink="/domestic"
          viewAllText="Explore All Tours"
        />
        <div className={styles.wrap}>
          {loading ? (
             <div className={styles.loadingWrapper}>
               <p className="text-muted">Loading trending tours...</p>
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
               <p className="text-muted">No trending tours available right now.</p>
             </div>
          )}
        </div>
      </CustomContainer>
    </section>
  );
};

export default TrendingTours;
