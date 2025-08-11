import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";

const MediaCarousel = ({ media }) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const swiperRef = useRef(null);
  const paginationRef = useRef(null);
  const nextButtonRef = useRef(null);
  const prevButtonRef = useRef(null);

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    setActiveIndex(swiper.activeIndex);
  };

  if (!Array.isArray(media) || media.length === 0) return null;

  if (media.length === 1) {
    const single = media[0];
    return single.includes(".mp4") ? (
      <video autoPlay loop>
        <source src={single} type="video/mp4" />
        Your browser does not support video.
      </video>
    ) : (
      <img src={single} alt="Post media" />
    );
  }

  return (
    <Swiper
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      onInit={(swiper) => {
        swiperRef.current = swiper;
        swiper.params.navigation.prevEl = prevButtonRef.current;
        swiper.params.navigation.nextEl = nextButtonRef.current;
        swiper.params.pagination.el = paginationRef.current;
        swiper.navigation.init();
        swiper.navigation.update();
        swiper.pagination.init();
        swiper.pagination.update();
      }}
      onSlideChange={handleSlideChange}
      spaceBetween={10}
      slidesPerView={1}
      pagination={{
        clickable: true,
        el: paginationRef.current,
        bulletClass: "media-bullet",
        bulletActiveClass: "media-bullet-active",
      }}
      navigation={{
        nextEl: nextButtonRef.current,
        prevEl: prevButtonRef.current,
      }}
      modules={[Pagination, Navigation]}
      className="media"
    >
      {media.map((url, index) => (
        <SwiperSlide key={index}>
          {url.includes(".mp4") ? (
            <video autoPlay loop>
              <source src={url} type="video/mp4" />
              Your browser does not support video.
            </video>
          ) : (
            <img src={url} alt={`Post media ${index}`} />
          )}
        </SwiperSlide>
      ))}

      <div ref={paginationRef} className="media-pagination">
        {media.map((_, index) => (
          <div
            key={index}
            className={`media-bullet ${activeIndex === index ? "media-bullet-active" : ""}`}
            onClick={() => swiperRef.current?.slideTo(index)}
          ></div>
        ))}
      </div>

      <button
        ref={prevButtonRef}
        className={`media-button media-button-prev ${isBeginning ? "media-button-disabled" : ""}`}
        disabled={isBeginning}
      >
        <MdOutlineArrowBackIos
          size={18}
          style={{ color: "var(--text-white)", opacity: isBeginning ? "0.3" : "1" }}
        />
      </button>
      <button
        ref={nextButtonRef}
        className={`media-button media-button-next ${isEnd ? "media-button-disabled" : ""}`}
        disabled={isEnd}
      >
        <MdOutlineArrowForwardIos
          size={18}
          style={{ color: "var(--text-white)", opacity: isEnd ? "0.3" : "1" }}
        />
      </button>
    </Swiper>
  );
};

export default MediaCarousel;
