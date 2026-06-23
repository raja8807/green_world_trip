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
        <div className={styles.mapContainer} data-aos="fade-up">
          <IndiaMap
            type="select-single"
            size={600}
            mapColor="#e4e6ef"
            strokeColor="#ffffff"
            strokeWidth={1}
            hoverColor="#73b63b"
            selectColor="#73b63b"
            hints={true}
            hintTextColor="#ffffff"
            hintBackgroundColor="#73b63b"
            hintPadding="8px 12px"
            hintBorderRadius={4}
            onSelect={handleStateSelect}
          />
        </div>
      </CustomContainer>
    </div>
  );
};

export default IndiaScreen;
