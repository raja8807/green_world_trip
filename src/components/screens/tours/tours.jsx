import React, { useState, useMemo } from 'react';
import PageBanner from '@/components/common/page_banner/page_banner';
import { Container, Offcanvas } from 'react-bootstrap';
import TourCard from '@/components/common/tour_card/tour_card';
import styles from './tours.module.scss';
import { Filter, ArrowLeft } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';
import CustomContainer from '@/components/ui/custom_container/custom_container';

const ToursScreen = ({ tours, error, category }) => {
  const router = useRouter();
  const [selectedDests, setSelectedDests] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Format the title
  const formattedTitle = category 
    ? category.charAt(0).toUpperCase() + category.slice(1) + " Tours"
    : "Our Tours";

  // Extract unique filter options
  const uniqueDestinations = useMemo(() => {
    const allDests = tours.flatMap(t => t.destinations || []);
    return [...new Set(allDests)].sort();
  }, [tours]);

  const uniqueTypes = useMemo(() => {
    const allTypes = tours.map(t => t.tour_type).filter(Boolean);
    return [...new Set(allTypes)].sort();
  }, [tours]);

  const uniqueDurations = useMemo(() => {
    const allDurations = tours.map(t => t.duration_days).filter(Boolean);
    return [...new Set(allDurations)].sort((a, b) => a - b);
  }, [tours]);

  // Handle checkbox changes
  const handleCheckboxChange = (setter, value) => {
    setter(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value) 
        : [...prev, value]
    );
  };

  // Derived filtered tours
  const filteredTours = useMemo(() => {
    let result = tours;

    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(tour => 
        (tour.name && tour.name.toLowerCase().includes(lowerQuery)) || 
        (tour.location && tour.location.toLowerCase().includes(lowerQuery))
      );
    }

    if (selectedDests.length > 0) {
      result = result.filter(tour => 
        tour.destinations && tour.destinations.some(d => selectedDests.includes(d))
      );
    }

    if (selectedTypes.length > 0) {
      result = result.filter(tour => 
        tour.tour_type && selectedTypes.includes(tour.tour_type)
      );
    }

    if (selectedDurations.length > 0) {
      result = result.filter(tour => 
        tour.duration_days && selectedDurations.includes(tour.duration_days)
      );
    }

    return result;
  }, [tours, selectedDests, selectedTypes, selectedDurations, searchQuery]);

  return (
    <>
      <PageBanner 
        title={formattedTitle} 
        image="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80" 
      />
      
      <section className={styles.toursPage}>
        <CustomContainer lg>
          {error ? (
            <div className={styles.noTours}>
              <p>Failed to load tours. Please try again later.</p>
              <small>{error}</small>
            </div>
          ) : tours.length === 0 ? (
            <div className={styles.noTours}>
              <p>No tours available in this category at the moment. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <button 
                  onClick={() => router.back()} 
                  className="btn btn-light shadow-sm d-inline-flex align-items-center px-4 py-2"
                  style={{ borderRadius: '8px', fontWeight: '600', color: '#444' }}
                >
                  <ArrowLeft className="me-2" /> Back
                </button>
              </div>
              <div className={styles.layoutWrapper}>
              
              {/* Sidebar Filter */}
              <div className={styles.sidebarColumn}>
                <Offcanvas 
                  show={showMobileFilter} 
                  onHide={() => setShowMobileFilter(false)} 
                  responsive="lg"
                  className={styles.offcanvasSidebar}
                >
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="fw-bold">Filters</Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body className="d-block p-lg-0">
                    <div className={styles.filterCard}>
                      <h4 className="mt-4">Filter by Destination</h4>
                    <div className={styles.filterGroup}>
                      {uniqueDestinations.map((dest, idx) => (
                        <div key={`dest-${idx}`} className={styles.checkboxItem}>
                          <input 
                            type="checkbox" 
                            id={`dest-${idx}`}
                            checked={selectedDests.includes(dest)}
                            onChange={() => handleCheckboxChange(setSelectedDests, dest)}
                          />
                          <label htmlFor={`dest-${idx}`}>{dest}</label>
                        </div>
                      ))}
                      {uniqueDestinations.length === 0 && (
                        <p className="text-muted small">No destinations available</p>
                      )}
                    </div>

                    <h4 className="mt-4">Tour Type</h4>
                    <div className={styles.filterGroup}>
                      {uniqueTypes.map((type, idx) => (
                        <div key={`type-${idx}`} className={styles.checkboxItem}>
                          <input 
                            type="checkbox" 
                            id={`type-${idx}`}
                            checked={selectedTypes.includes(type)}
                            onChange={() => handleCheckboxChange(setSelectedTypes, type)}
                          />
                          <label htmlFor={`type-${idx}`}>{type}</label>
                        </div>
                      ))}
                      {uniqueTypes.length === 0 && (
                        <p className="text-muted small">No types available</p>
                      )}
                    </div>

                    <h4 className="mt-4">Duration</h4>
                    <div className={styles.filterGroup}>
                      {uniqueDurations.map((duration, idx) => (
                        <div key={`dur-${idx}`} className={styles.checkboxItem}>
                          <input 
                            type="checkbox" 
                            id={`dur-${idx}`}
                            checked={selectedDurations.includes(duration)}
                            onChange={() => handleCheckboxChange(setSelectedDurations, duration)}
                          />
                          <label htmlFor={`dur-${idx}`}>{duration} Days</label>
                        </div>
                      ))}
                      {uniqueDurations.length === 0 && (
                        <p className="text-muted small">No durations available</p>
                      )}
                    </div>
                    </div>
                  </Offcanvas.Body>
                </Offcanvas>
              </div>

              {/* Main Grid */}
              <div className={styles.gridColumn}>
                
                {/* Search Bar */}
                <div className={styles.topSearchWrapper}>
                  <div className={styles.searchGroup}>
                    <button 
                      className={styles.mobileFilterBtn}
                      onClick={() => setShowMobileFilter(true)}
                      aria-label="Show Filters"
                    >
                      <Filter size={22} />
                    </button>
                    
                    <input 
                      type="text" 
                      placeholder="Search tours by name or location..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                </div>

                {filteredTours.length === 0 ? (
                  <div className={styles.noTours}>
                    <p>No tours match your selected filters.</p>
                    <button 
                      className="btn btn-outline-primary mt-3"
                      onClick={() => {
                        setSelectedDests([]);
                        setSelectedTypes([]);
                        setSelectedDurations([]);
                        setSearchQuery("");
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className={styles.toursGrid}>
                    {filteredTours.map((tour) => (
                      <TourCard key={tour.id} tour={tour} />
                    ))}
                  </div>
                )}
              </div>

            </div>
            </>
          )}
        </CustomContainer>
      </section>
    </>
  );
};

export default ToursScreen;
