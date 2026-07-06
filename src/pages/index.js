import HomeScreen from "@/components/screens/home/home";
import SEO from "@/components/common/seo/seo";

const Home = () => {
  return (
    <>
      <SEO title="Home" description="Welcome to Green World Trip. Find the best tour packages, honeymoons, and international travel experiences." />
      <HomeScreen />
    </>
  );
};

export default Home;
