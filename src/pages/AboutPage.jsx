import React, { useEffect } from "react";

import Slider from "../components/Slider";
import HowItWorks from "../components/HowItWorks";
import OurTeam from "../components/OurTeam";
import LetterSection from "../components/LetterSection";
import ShareBlok from "../components/ShareBlok";
import Footer from "../components/Footer";

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Slider />
      <HowItWorks />
      <OurTeam />
      <LetterSection />
      <ShareBlok />
      <Footer />
    </div>
  );
};

export default AboutPage;
