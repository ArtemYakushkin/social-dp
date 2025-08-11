import React, { useEffect } from "react";

import Slider from "../../components/Slider/Slider";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import OurTeam from "../../components/OurTeam/OurTeam";
import LetterSection from "../../components/LetterSection/LetterSection";
import ShareBlok from "../../components/ShareBlok/ShareBlok";

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Slider />
      <HowItWorks />
      <OurTeam />
      <LetterSection />
      <ShareBlok />
    </>
  );
};

export default AboutPage;
