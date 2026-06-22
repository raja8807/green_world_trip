import React, { useEffect, useState } from "react";
import styles from "./trending.module.scss";
import TourCard from "@/components/common/tour_card/tour_card";
import CustomContainer from "@/components/ui/custom_container/custom_container";
import { Col, Row } from "react-bootstrap";
import { supabase } from "@/lib/supabaseClient";

const TrendingTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingTours = async () => {
      try {
        // Fetch tours where the flags JSONB column contains { "is_trending": true }
        const { data, error } = await supabase
          .from("tours")
          .select("*")
          .contains('flags', { is_trending: true })
          .limit(4);

        if (error) throw error;
        
        // Fallback: If no tours are marked 'is_trending', try 'is_featured'
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
        <h2>Trending Tours</h2>
        <div className={styles.wrap}>
          {loading ? (
             <p className="text-muted">Loading trending tours...</p>
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
             <p className="text-muted">No trending tours available right now.</p>
          )}
        </div>
      </CustomContainer>
    </section>
  );
};

export default TrendingTours;
