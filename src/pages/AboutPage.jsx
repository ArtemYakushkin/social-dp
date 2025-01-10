import React, { useEffect } from "react";

import Slider from "../components/Slider";
import HowItWorks from "../components/HowItWorks";
import OurTeam from "../components/OurTeam";
import ShareBlok from "../components/ShareBlok";
import Footer from "../components/Footer";

const AboutPage = () => {
  useEffect(() => {
    // Прокрутка на начало страницы при монтировании компонента
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Slider />
      <HowItWorks />
      <OurTeam />
      <ShareBlok />
      <Footer />
    </div>
  );
};

export default AboutPage;
