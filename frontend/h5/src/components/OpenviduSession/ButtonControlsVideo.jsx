import "./ButtonControlsVideo.css";
import PropTypes from "prop-types";
import { FaVideo, FaMicrophone, FaPhoneSlash, FaDesktop } from "react-icons/fa";

function ButtonControlsVideo({
  userType,
  onScreenShare,
  onVideoToggle,
  onAudioToggle,
  onEndCall,
}) {
  return (
    <div className="web-button-controls-container">
      {userType === "consultant" && (
        <button className="web-control-btn" onClick={onScreenShare}>
          <FaDesktop />
        </button>
      )}
      <button className="web-control-btn" onClick={onVideoToggle}>
        <FaVideo />
      </button>
      <button className="web-control-btn" onClick={onAudioToggle}>
        <FaMicrophone />
      </button>
      <button className="web-control-btn end-call" onClick={onEndCall}>
        <FaPhoneSlash />
      </button>
    </div>
  );
}

ButtonControlsVideo.propTypes = {
  userType: PropTypes.string,
  onScreenShare: PropTypes.func,
  onVideoToggle: PropTypes.func,
  onAudioToggle: PropTypes.func,
  onEndCall: PropTypes.func,
};
export default ButtonControlsVideo;
