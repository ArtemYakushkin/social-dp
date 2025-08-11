import { RiInformationLine } from "react-icons/ri";

const InfoBoard = ({ message }) => {
  return (
    <div className="container">
      <div className="board-box">
        <RiInformationLine size={24} />
        <p className="board-message">{message}</p>
      </div>
    </div>
  );
};

export default InfoBoard;
