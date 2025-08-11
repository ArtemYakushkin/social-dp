import React from "react";
import { useMediaQuery } from "react-responsive";

import CardProfileDesk from "./CardProfileDesk";
import CardProfileTab from "./CardProfileTab";
import CardProfileMobile from "./CardProfileMobile";

const CardProfile = ({
  avatar,
  nickname,
  cover,
  facebookLink,
  instagramLink,
  telegramLink,
  country,
  profession,
  setIsModalOpen,
  setIsModalSetting,
  isAllowed,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1259px)" });

  return (
    <>
      {isMobile ? (
        <CardProfileMobile
          avatar={avatar}
          nickname={nickname}
          cover={cover}
          facebookLink={facebookLink}
          instagramLink={instagramLink}
          telegramLink={telegramLink}
          country={country}
          profession={profession}
          setIsModalOpen={setIsModalOpen}
          setIsModalSetting={setIsModalSetting}
          isAllowed={isAllowed}
        />
      ) : isTablet ? (
        <CardProfileTab
          avatar={avatar}
          nickname={nickname}
          cover={cover}
          facebookLink={facebookLink}
          instagramLink={instagramLink}
          telegramLink={telegramLink}
          country={country}
          profession={profession}
          setIsModalOpen={setIsModalOpen}
          setIsModalSetting={setIsModalSetting}
          isAllowed={isAllowed}
        />
      ) : (
        <CardProfileDesk
          avatar={avatar}
          nickname={nickname}
          cover={cover}
          facebookLink={facebookLink}
          instagramLink={instagramLink}
          telegramLink={telegramLink}
          country={country}
          profession={profession}
          setIsModalOpen={setIsModalOpen}
          setIsModalSetting={setIsModalSetting}
          isAllowed={isAllowed}
        />
      )}
    </>
  );
};

export default CardProfile;
