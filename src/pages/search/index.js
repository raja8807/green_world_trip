import React from "react";
import { supabase } from "@/lib/supabaseClient";
import ToursScreen from "@/components/screens/tours/tours";

export default function SearchResultsPage({
  tours,
  error,
  searchQuery,
}) {
  return (
    <ToursScreen 
      tours={tours} 
      error={error} 
      category="Search Results" 
      initialSearchQuery={searchQuery} 
    />
  );
}

export async function getServerSideProps({ query }) {
  const searchQuery = query.q || "";

  try {
    let supabaseQuery = supabase
      .from("tours")
      .select("*")
      .order("created_at", { ascending: false });

    // If there is a search query, we filter by name or location
    if (searchQuery.trim() !== "") {
      const sanitizedQuery = searchQuery.replace(/-/g, " ");
      supabaseQuery = supabaseQuery.or(
        `name.ilike.%${sanitizedQuery}%,location.ilike.%${sanitizedQuery}%,state_country.ilike.%${sanitizedQuery}%`
      );
    }

    const { data: tours, error } = await supabaseQuery;

    if (error) throw error;

    return {
      props: {
        tours: tours || [],
        searchQuery,
      },
    };
  } catch (error) {
    console.error(`Error fetching search results:`, error);
    return {
      props: {
        tours: [],
        error: error.message,
        searchQuery,
      },
    };
  }
}
