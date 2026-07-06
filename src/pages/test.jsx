import React from "react";

const TourDetailsPage = () => {
  const handleClick = async () => {
    try {
      const res = await fetch("/api/test");
      const x = res.json();
      console.log(x);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Test</button>
    </div>
  );
};

export default TourDetailsPage;
