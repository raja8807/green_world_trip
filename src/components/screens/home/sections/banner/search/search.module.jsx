import React, { useState } from "react";
import styles from "./searchBar.module.scss";

import { CalendarRange, ChevronDown, GeoAlt } from "react-bootstrap-icons";

const SearchBar = () => {
  const [destination, setDestination] = useState("");
  const [fromDate, setFromDate] = useState("2026-09-09");
  const [toDate, setToDate] = useState("2026-10-10");
  const [travellers, setTravellers] = useState("More");

  const handleSearch = () => {
    console.log({
      destination,
      fromDate,
      toDate,
      travellers,
    });
  };

  return (
    <div className={styles.searchBox} data-aos="fade-up">
      {/* Destination */}
      <div className={styles.field}>
      

        <div className={styles.info}>
          <label>Destination</label>

          <input
            type="text"
            placeholder="Where are you going?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
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

      {/* Advance */}
      {/* <div className={styles.field}>
        <div className={styles.info}>
          <label>Advance</label>

          <select
            value={travellers}
            onChange={(e) => setTravellers(e.target.value)}
          >
            <option>More</option>
            <option>1 Traveller</option>
            <option>2 Travellers</option>
            <option>Family</option>
          </select>

          <ChevronDown className={styles.arrow} />
        </div>
      </div> */}

      {/* Button */}
      <button className={styles.searchBtn} onClick={handleSearch}>
        SEARCH
      </button>
    </div>
  );
};

export default SearchBar;