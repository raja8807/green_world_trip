import React, { useEffect, useState } from "react";
import styles from "./destinations_section.module.scss";
import { Image } from "react-bootstrap";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

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
      <div className={styles.container}>
        <h2>Top Destinations</h2>

        <div className={styles.grid}>
          {loading ? (
             <p className="text-muted">Loading destinations...</p>
          ) : (
            destinations.map((item) => (
              <Link
                href={item.href}
                key={item.id}
                className={`${styles.card} ${
                  item.is_large ? styles.large : ""
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

                  <button>{item.tours_text}</button>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;