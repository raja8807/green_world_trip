import React from 'react';
import { useRouter } from 'next/router';
import IndiaMap from '@react-map/india';
import CustomContainer from '@/components/ui/custom_container/custom_container';
import PageBanner from '@/components/common/page_banner/page_banner';
import styles from './india.module.scss';

const IndiaScreen = () => {
  const router = useRouter();

  const handleStateSelect = (state) => {
    if (state) {
      router.push(`/domestic/${encodeURIComponent(state)}`);
    }
  };

  return (
    <div className={styles.indiaPage}>
      <PageBanner
        title="Explore India"
        image={'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80'}
        description="Select a state to explore domestic tours and packages"
      />
      <CustomContainer>
        <div className={styles.mapWrapper}>
          <div className={styles.mapIntro} data-aos="fade-down">
            <h2>Interactive Map</h2>
            <p>Hover over the map and click on any state to view our exclusive domestic tour packages tailored just for you.</p>
          </div>
          <div className={styles.mapContainer} data-aos="zoom-in" data-aos-delay="200">
            <IndiaMap
              type="select-single"
              size={700}
              mapColor="#222222"
              strokeColor="#121212"
              strokeWidth={1.5}
              hoverColor="#73b63b"
              selectColor="#04a8e9"
              hints={true}
              hintTextColor="#121212"
              hintBackgroundColor="#e1dfdf"
              hintPadding="12px 18px"
              hintBorderRadius={8}
              onSelect={handleStateSelect}
            />
          </div>
        </div>
      </CustomContainer>
    </div>
  );
};

export default IndiaScreen;
