import { useModal } from "./ModalContext";
import {
  FaHome,
  FaUser,
  FaCog,
  FaBell,
  FaEnvelope,
  FaSignOutAlt,
  FaBeer,
  FaFileInvoiceDollar,
} from "react-icons/fa";

import { AiFillExclamationCircle } from "react-icons/ai";
import { Link } from "react-router-dom";

const MyModal = () => {
  const { isOpen, closeModal } = useModal();

  if (!isOpen) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <h2>Quick Actions</h2>
        <div style={styles.iconContainer}>
          <Link style={{ textDecoration: "none", color: "inherit" }} to={"/"}>
            <div style={styles.iconItem}>
              <FaHome size={32} />
              <span>Home</span>
            </div>
          </Link>
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to={"/outstanding"}
          >
            <div style={styles.iconItem}>
              <AiFillExclamationCircle size={32} />
              <span>OutStanding</span>
            </div>
          </Link>

          <div style={styles.iconItem}>
            <FaSignOutAlt size={32} />
            <span>Logout</span>
          </div>

          {/* <div style={styles.iconItem}>
            <FaUser size={32} />
            <span>Profile</span>
          </div>
          <div style={styles.iconItem}>
            <FaCog size={32} />
            <span>Settings</span>
          </div>
          <div style={styles.iconItem}>
            <FaBell size={32} />
            <span>Notifications</span>
          </div>
          <div style={styles.iconItem}>
            <FaEnvelope size={32} />
            <span>Messages</span>
          </div> */}
        </div>
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    textAlign: "center",
  },
  iconContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "2rem",
    margin: "1rem 0",
  },
  iconItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
  },
};

export default MyModal;
