import React from "react";
import Modal from "react-modal";

import { IoIosClose } from "react-icons/io";

import "../styles/ModalImageBig.css";

const ModalImageBig = ({ imageUrl, onClose, isOpen }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Search GIFs"
      className="modal-imgBig"
      overlayClassName="modal-imgBig-overlay"
    >
      <button className="modal-imgBig-btn-close" onClick={onClose}>
        <IoIosClose size={30} color="var(--text-grey-dark)" />
      </button>

      <img className="modal-imgBig-image" src={imageUrl} alt="Big" />
    </Modal>
  );
};

export default ModalImageBig;
