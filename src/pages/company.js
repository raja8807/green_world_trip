import SEO from "@/components/common/seo/seo";
import AboutScreen from "@/components/screens/about/about";

const CompanyPage = () => {
  return (
    <>
      <SEO
        title="Company"
        description="Learn more about Green World Trip and our mission to provide you with the best travel experiences."
      />
      <AboutScreen />
    </>
  );
};

export default CompanyPage;
