import React, { useState, useEffect } from "react";
import styles from "./searchBar.module.scss";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

const SearchBar = () => {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [destinationsList, setDestinationsList] = useState([]);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data, error } = await supabase
          .from("top_destinations")
          .select("title")
          .order("title", { ascending: true });
        
        if (!error && data) {
          setDestinationsList(data.map(d => d.title));
        }
      } catch (err) {
        console.error("Failed to load destinations", err);
      }
    };
    fetchDestinations();
  }, []);

  const handleSearch = () => {
    if (destination.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(destination.trim())}`);
    } else {
      router.push(`/search`);
    }
  };

  return (
    <div className={`${styles.searchBox} ${isSticky ? styles.sticky : ""}`} data-aos="fade-up">
      <div className={styles.innerWrapper}>
        {/* Destination */}
        <div className={styles.field}>
      

        <div className={styles.info}>
          <label>Destination</label>

          <input
            type="text"
            list="destination-options"
            placeholder="Where are you going?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <datalist id="destination-options">
            {destinationsList.map((dest, idx) => (
              <option key={idx} value={dest} />
            ))}
          </datalist>
        </div>
      </div>

      {/* Dates */}
      <div className={styles.field}>
      

        <div className={styles.info}>
          <label>From - To</label>

          <div className={styles.dateWrapper}>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />

            <span>-</span>

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
      </div>


        {/* Button */}
        <button className={styles.searchBtn} onClick={handleSearch}>
          SEARCH
        </button>
      </div>
    </div>
  );
};

export default SearchBar;