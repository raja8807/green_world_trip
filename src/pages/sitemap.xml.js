import { supabase } from "@/lib/supabaseClient";

const BASE_URL = "https://www.greenworldtrip.com";

function generateSiteMap(tours, categories, destinations) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${BASE_URL}</loc>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${BASE_URL}/company</loc>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${BASE_URL}/contact</loc>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${BASE_URL}/terms-and-conditions</loc>
       <changefreq>yearly</changefreq>
       <priority>0.5</priority>
     </url>
     <url>
       <loc>${BASE_URL}/privacy-policy</loc>
       <changefreq>yearly</changefreq>
       <priority>0.5</priority>
     </url>
     <url>
       <loc>${BASE_URL}/refund-policy</loc>
       <changefreq>yearly</changefreq>
       <priority>0.5</priority>
     </url>
     ${categories
       .map((category) => {
         return `
       <url>
           <loc>${BASE_URL}/${category}</loc>
           <changefreq>weekly</changefreq>
           <priority>0.9</priority>
       </url>
     `;
       })
       .join("")}
     ${destinations
       .map(({ category, destination }) => {
         const formattedDest = destination.replace(/\s+/g, "-");
         return `
       <url>
           <loc>${BASE_URL}/${category}/${formattedDest}</loc>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join("")}
     ${tours
       .map(({ slug, created_at }) => {
         return `
       <url>
           <loc>${BASE_URL}/tours/${slug}</loc>
           <lastmod>${created_at ? new Date(created_at).toISOString() : new Date().toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.9</priority>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  try {
    // We fetch tours to generate dynamic routes
    const { data: tours, error } = await supabase
      .from("tours")
      .select("slug, category_type, state_country, created_at");

    if (error) {
      throw error;
    }

    const categories = Array.from(new Set(tours.map(t => t.category_type).filter(Boolean)));
    
    // Get unique category/destination pairs
    const destinationMap = new Map();
    tours.forEach(t => {
      if (t.category_type && t.state_country) {
        destinationMap.set(`${t.category_type}-${t.state_country}`, {
          category: t.category_type,
          destination: t.state_country
        });
      }
    });
    const destinations = Array.from(destinationMap.values());

    const sitemap = generateSiteMap(tours, categories, destinations);

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (err) {
    console.error("Error generating sitemap", err);
    res.statusCode = 500;
    res.end();
    return {
      props: {},
    };
  }
}

export default SiteMap;
