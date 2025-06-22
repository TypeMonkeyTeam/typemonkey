import { Link } from "react-router-dom";
import "./Header.scss";
import MinimizeIcon from "../../assets/icons/Minimize";
import CloseIcon from "../../assets/icons/Close";

const Header = () => {

  const close = () => {
    if (window.electronAPI?.closeWindow) {
      window.electronAPI.closeWindow();
    } else {
      console.warn("electronAPI.closeWindow is not available");
    }
  };
  
  const minimize = () => {
    if (window.electronAPI?.minimizeWindow) {
      window.electronAPI.minimizeWindow();
    } else {
      console.warn("electronAPI.minimizeWindow is not available");
    }
  };
  

  return (
    <div className="header">
      <div className="drag-area"></div>
      <div className="logo">
        <img src="./monkey.png" alt="TypeMonkey" />
        TypeMonkey
      </div>
      <div className="controls">
        <div className="minimize" onClick={minimize}>
          <MinimizeIcon />
        </div>
        <div className="close" onClick={close}>
          <CloseIcon />
        </div>
      </div>
    </div>
  );
};

export default Header;
