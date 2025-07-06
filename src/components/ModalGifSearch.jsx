import React, { useState, useEffect } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Gif } from "@giphy/react-components";
import Modal from "react-modal";
import { useMediaQuery } from "react-responsive";

import { IoIosClose } from "react-icons/io";
import { FiSearch } from "react-icons/fi";

import "../styles/ModalGifSearch.css";

const gf = new GiphyFetch(process.env.REACT_APP_GIPHY_API_KEY);

const ModalGifSearch = ({ isOpen, onClose, onGifSelect }) => {
  const [gifSearchTerm, setGifSearchTerm] = useState("");
  const [gifs, setGifs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const LIMIT = 9;

  const searchGifs = async (isLoadMore = false) => {
    if (!gifSearchTerm.trim()) return;

    setIsLoading(true);
    const { data } = await gf.search(gifSearchTerm, { offset, limit: LIMIT });

    setGifs((prev) => (isLoadMore ? [...prev, ...data] : data));
    setOffset((prev) => prev + LIMIT);
    setIsLoading(false);
  };

  const handleSelectGif = (gif) => {
    onGifSelect(gif.images.original.url);
    onClose();
  };

  useEffect(() => {
    setOffset(0);
    setGifs([]);
  }, [gifSearchTerm]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Search GIFs"
      className="modal-gif"
      overlayClassName="modal-gif-overlay"
    >
      <button className="modal-gif-btn-close" onClick={onClose}>
        <IoIosClose size={30} color="var(--text-grey-dark)" />
      </button>

      <div className="modal-gif-search">
        <label>
          <input
            className="modal-gif-input"
            type="text"
            placeholder="Search GIFs..."
            value={gifSearchTerm}
            onChange={(e) => setGifSearchTerm(e.target.value)}
          />
          <FiSearch
            className="modal-gif-search-icon"
            size={24}
            onClick={() => {
              setOffset(0);
              searchGifs(false);
            }}
            disabled={isLoading || !gifSearchTerm.trim()}
          />
        </label>
      </div>

      <div className="modal-gif-content">
        <div className="modal-gif-result">
          {gifs.map((gif) => (
            <div key={gif.id} onClick={() => handleSelectGif(gif)} style={{ cursor: "pointer" }}>
              <Gif gif={gif} width={isMobile ? "80" : "100"} noLink />
            </div>
          ))}
        </div>
        {gifs.length > 0 && (
          <button
            className="modal-gif-btn-more"
            onClick={() => searchGifs(true)}
            disabled={isLoading}
          >
            Load more
          </button>
        )}
      </div>
    </Modal>
  );
};

export default ModalGifSearch;
