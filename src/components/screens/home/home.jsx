import React from "react";
import BannerSection from "./sections/banner/banner";
import TrendingTours from "./sections/trending/trending";
import FeaturedTours from "./sections/featured/featured";
import TourCategories from "./sections/tour_categories/tour_categories";
import CardsSection from "./sections/cards/cards_section";
import DestinationsSection from "./sections/destinations_section/destinations_section";
import TestimonialsSection from "./sections/testimonials_section/testimonials_section";

const HomeScreen = () => {
  return (
    <>
      <BannerSection />
      <CardsSection/>
      <TourCategories />
      <TrendingTours />
      <FeaturedTours />
      <DestinationsSection/>
      <TestimonialsSection/>
    </>
  );
};

export default HomeScreen;
