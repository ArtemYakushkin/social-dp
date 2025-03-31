import React, { useEffect } from "react";

import Slider from "../components/Slider";
import HowItWorks from "../components/HowItWorks";
import OurTeam from "../components/OurTeam";
import LetterSection from "../components/LetterSection";
import ShareBlok from "../components/ShareBlok";

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
    </div>
  );
};

export default AboutPage;
