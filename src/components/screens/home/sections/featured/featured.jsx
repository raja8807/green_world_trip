import React, { useEffect, useState } from "react";
import styles from "./featured.module.scss";
import TourCard from "@/components/common/tour_card/tour_card";
import CustomContainer from "@/components/ui/custom_container/custom_container";
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
        <h2>Featured Tours</h2>
        <div className={styles.wrap}>
          {loading ? (
             <p className="text-muted">Loading featured tours...</p>
          ) : tours && tours.length > 0 ? (
            <Row>
              {tours.map((tour) => {
                return (
                  <Col key={tour.id} xs={12} md={6} lg={3} className="mb-4">
                    <TourCard tour={tour} />
                  </Col>
                );
              })}
            </Row>
          ) : (
             <p className="text-muted">No featured tours available right now.</p>
          )}
        </div>
      </CustomContainer>
    </section>
  );
};

export default FeaturedTours;
