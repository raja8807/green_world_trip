import React, { useEffect, useState } from "react";
import styles from "./destinations_section.module.scss";
import { Image } from "react-bootstrap";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { getImageUrl } from "@/utils/image";
import SectionHeading from "@/components/common/section_heading/section_heading";
import CustomContainer from "@/components/ui/custom_container/custom_container";
import FONTS from "@/styles/fonts";
import { ArrowUpRight } from "react-bootstrap-icons";

const DestinationsSection = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data, error } = await supabase
          .from("top_destinations")
          .select("*")
          .order("sort_order", { ascending: true });

        if (error) throw error;
        setDestinations(data || []);
      } catch (err) {
        console.error("Error fetching top destinations:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <section className={styles.DestinationsSection} data-aos="fade-up">
      <CustomContainer>
        <SectionHeading 
          subtitle="ICONIC LOCALES"
          title="Top Destinations"
          text="From majestic cultural sanctuaries to sun-drenched coastal wonders, find your next getaway."
          viewAllLink="/domestic"
          viewAllText="Explore All"
        />

        <div className={styles.grid}>
          {loading ? (
             <div className={styles.loadingWrapper}>
               <p className="text-muted">Loading destinations...</p>
             </div>
          ) : (
            destinations.map((item, idx) => (
              <Link
                href={item.href || "#"}
                key={item.id}
                className={`${styles.card} ${
                  item.is_large ? styles.large : ""
                }`}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <Image
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  className={styles.image}
                />

                <div className={styles.overlay}></div>

                <div className={styles.content}>
                  <div className={styles.topInfo}>
                    <span className={styles.tourBadge}>
                      {item.tours_text || "Explore"}
                    </span>
                    <span className={styles.arrowCircle}>
                      <ArrowUpRight />
                    </span>
                  </div>

                  <h3 className={FONTS.font2}>{item.title}</h3>
                </div>
              </Link>
            ))
          )}
        </div>
      </CustomContainer>
    </section>
  );
};

export default DestinationsSection;