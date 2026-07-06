import React from "react";
import CategoryRegionsScreen from "@/components/screens/tours/category_regions/category_regions";
import { supabase } from "@/lib/supabaseClient";
import SEO from "@/components/common/seo/seo";

export default function CategoryLandingPage({ groupedRegions, category }) {
  const displayCategory = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Tours";
  return (
    <>
      <SEO title={`${displayCategory} Tours`} description={`Browse our best ${category} tour packages and destinations.`} />
      <CategoryRegionsScreen
        groupedRegions={groupedRegions}
        category={category}
      />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { category } = params;

  // Validate the category to prevent unnecessary DB calls if it's invalid
  if (
    category !== "domestic" &&
    category !== "international" &&
    category !== "honeymoon" &&
    category !== "group"
  ) {
    return {
      notFound: true,
    };
  }

  try {
    const { data, error } = await supabase
      .from("tours")
      .select("region_continent, state_country")
      .eq("category_type", category);

    if (error) throw error;

    const regionsMap = {};

    data.forEach((tour) => {
      const region = tour.region_continent || "Other";
      const state = tour.state_country;

      if (state) {
        if (!regionsMap[region]) {
          regionsMap[region] = new Set();
        }
        regionsMap[region].add(state);
      }
    });

    const groupedRegions = Object.keys(regionsMap)
      .map((region) => ({
        region,
        states: Array.from(regionsMap[region]).sort(),
      }))
      .sort((a, b) => a.region.localeCompare(b.region));

    return {
      props: {
        groupedRegions,
        category,
      },
    };
  } catch (error) {
    console.error(`Error fetching ${category} regions:`, error);
    return {
      props: {
        groupedRegions: [],
        category,
      },
    };
  }
}
