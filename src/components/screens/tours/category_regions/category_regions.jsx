import React, { useState, useMemo } from 'react';
import PageBanner from '@/components/common/page_banner/page_banner';
import { Container } from 'react-bootstrap';
import styles from './category_regions.module.scss';
import Link from 'next/link';
import { Search } from 'react-bootstrap-icons';

const CategoryRegionsScreen = ({ groupedRegions, category }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');

  const formattedCategory = category 
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "Tours";

  // Get list of all unique region names for the pills
  const regionNames = useMemo(() => {
    if (!groupedRegions) return [];
    return ['All', ...groupedRegions.map(r => r.region)];
  }, [groupedRegions]);

  // Derived filtered regions
  const filteredRegions = useMemo(() => {
    if (!groupedRegions) return [];

    let filtered = groupedRegions;

    // Filter by Region Pill
    if (activeRegion !== 'All') {
      filtered = filtered.filter(r => r.region === activeRegion);
    }

    // Filter by Search Text
    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.map(regionData => {
        // Find states that match the search query
        const matchingStates = regionData.states.filter(stateName => 
          stateName.toLowerCase().includes(lowerQuery)
        );
        return { ...regionData, states: matchingStates };
      }).filter(regionData => regionData.states.length > 0); // Remove regions with 0 matching states
    }

    return filtered;
  }, [groupedRegions, activeRegion, searchQuery]);

  return (
    <>
      <PageBanner 
        title={`${formattedCategory} Tours`}
        image="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2000&q=80" 
      />
      
      <section className={styles.regionsPage}>
        <Container>
          
          {/* Top Controls: Search and Filters */}
          {groupedRegions && groupedRegions.length > 0 && (
            <div className={styles.controlsWrapper}>
              <div className={styles.searchBar}>
                <Search className={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder={`Search ${formattedCategory.toLowerCase()} destinations...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className={styles.regionPills}>
                {regionNames.map((name, idx) => (
                  <button 
                    key={idx} 
                    className={`${styles.pillBtn} ${activeRegion === name ? styles.active : ''}`}
                    onClick={() => setActiveRegion(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(!filteredRegions || filteredRegions.length === 0) ? (
            <div className="text-center py-5">
              <p className="text-muted" style={{ fontSize: '1.2rem' }}>
                No {category} destinations match your search. Try adjusting your filters!
              </p>
              <button 
                className="btn btn-outline-primary mt-3" 
                onClick={() => { setSearchQuery(''); setActiveRegion('All'); }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredRegions.map((regionData, idx) => (
              <div key={idx} className={styles.regionSection}>
                <div className={styles.regionHeader}>
                  <h2 className={styles.regionTitle}>{regionData.region}</h2>
                  <span className={styles.regionCount}>{regionData.states.length} Destinations</span>
                </div>
                
                <div className={styles.statesGrid}>
                  {regionData.states.map((stateName, sIdx) => {
                    const stateSlug = encodeURIComponent(stateName.toLowerCase().replace(/\s+/g, '-'));
                    return (
                      <Link href={`/${category}/${stateSlug}`} key={sIdx} className={styles.stateCard}>
                        <span className={styles.stateName}>{stateName}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </Container>
      </section>
    </>
  );
};

export default CategoryRegionsScreen;
