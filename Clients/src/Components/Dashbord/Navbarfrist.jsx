import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiGrid, FiLayers, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import { useModal } from "../global/ModalContext";

const Navbarfrist = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");
  const location = useLocation();

  const navLinksRef = useRef([]);

  const { openModifyBill } = useModal();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDropdown = (menu) =>
    setOpenDropdown((prev) => (prev === menu ? "" : menu));
  const closeSidebar = () => setIsOpen(false);
  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    backgroundColor: isActive(path) ? "#DC3545" : "transparent",
    padding: "8px 12px",
    fontWeight: isActive(path) ? "bold" : "normal",
    display: "block",
    marginBottom: "4px",
    color: "#fff",
    textDecoration: "none",
  });

  // SHIFT + S toggle
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.shiftKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus first link when open
  useEffect(() => {
    if (isOpen && navLinksRef.current[0]) {
      navLinksRef.current[0].focus();
    }
  }, [isOpen]);

  // Arrow nav
  useEffect(() => {
    const handleKeyNav = (event) => {
      if (!isOpen) return;

      const focusedIndex = navLinksRef.current.findIndex(
        (el) => el === document.activeElement
      );

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = (focusedIndex + 1) % navLinksRef.current.length;
        navLinksRef.current[nextIndex]?.focus();
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        const prevIndex =
          (focusedIndex - 1 + navLinksRef.current.length) %
          navLinksRef.current.length;
        navLinksRef.current[prevIndex]?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyNav);
    return () => document.removeEventListener("keydown", handleKeyNav);
  }, [isOpen]);

  return (
    <>
      <div
        className=" position-fixed w-100 bg-white py-2 d-flex align-items-center justify-content-between top-0 mb-5 start-0 z-3"
        style={{ zIndex: 1050 }}
      >
        <div className="d-flex align-items-center justify-content-between">
          {!isOpen && (
            <FiMenu
              className="text-dark fs-3"
              style={{ cursor: "pointer" }}
              onClick={toggleSidebar}
            />
          )}
          <h5 className="custom-logo mb-0">
            <span className="custom-logo-part1">Adarsh </span>
            <span className="custom-logo-part2">Agency</span>
          </h5>
        </div>
      </div>

      {/* Sidebar */}
      <div
        id="new-sidebar"
        className={`sidebar bg-dark text-white shadow position-fixed top-0 start-0 ${
          isOpen ? "open" : "collapsed"
        }`}
        style={{
          width: isOpen ? 250 : 0,
          transition: "width 0.3s",
          overflowY: "auto",
          overflowX: "hidden",
          height: "100vh",
          // minHeight: "100vh",
          zIndex: 1040,
        }}
      >
        <div className="sidebar-header d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
          <h5 className="m-0">
            Aadarsh <span className="text-warning bg-white px-1">Agency</span>
          </h5>
          <FiX
            className="sidebar-toggle text-white"
            style={{ cursor: "pointer" }}
            onClick={closeSidebar}
          />
        </div>

        <div className="px-3 py-0">
          <div className="small text-muted">Aadarsh &gt; Dashboard</div>
        </div>

        <nav className="nav flex-column py-2">
          <Link
            to="/"
            ref={(el) => (navLinksRef.current[0] = el)}
            style={navLinkStyle("/")}
            onClick={closeSidebar}
            className="d-flex align-items-center gap-2"
          >
            <FiGrid /> Dashboard
          </Link>

          <div className="dropdown mt-2">
            <button
              onClick={() => toggleDropdown("master")}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  setOpenDropdown("master");
                }
              }}
              className="btn text-white w-100 text-start d-flex align-items-center gap-2"
              ref={(el) => (navLinksRef.current[1] = el)}
            >
              <FiLayers /> Master <FiChevronDown size={12} />
            </button>
            {openDropdown === "master" && (
              <div className="ps-3 colored">
                <Link
                  to="/brand"
                  ref={(el) => (navLinksRef.current[2] = el)}
                  style={navLinkStyle("/brand")}
                  onClick={closeSidebar}
                >
                  Brand
                </Link>
                <Link
                  to="/product"
                  ref={(el) => (navLinksRef.current[3] = el)}
                  style={navLinkStyle("/product")}
                  onClick={closeSidebar}
                >
                  Product
                </Link>
                <Link
                  to="/Vendor-report"
                  ref={(el) => (navLinksRef.current[4] = el)}
                  style={navLinkStyle("/Vendor-report")}
                  onClick={closeSidebar}
                >
                  Party
                </Link>
                <Link
                  to="/add-customer"
                  ref={(el) => (navLinksRef.current[5] = el)}
                  style={navLinkStyle("/add-customer")}
                  onClick={closeSidebar}
                >
                  Customer
                </Link>
                <Link
                  to="/add-salesman"
                  ref={(el) => (navLinksRef.current[6] = el)}
                  style={navLinkStyle("/add-salesman")}
                  onClick={closeSidebar}
                >
                  Sales Man
                </Link>
              </div>
            )}
          </div>

          <div className="dropdown mt-2">
            <button
              onClick={() => toggleDropdown("sales")}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  toggleDropdown("sales");
                }
                if (e.key === "ArrowUp") {
                  toggleDropdown("master");
                }
              }}
              className="btn text-white w-100 text-start d-flex align-items-center gap-2"
              ref={(el) => (navLinksRef.current[7] = el)}
            >
              <FiLayers /> Sales <FiChevronDown size={12} />
            </button>
            {openDropdown === "sales" && (
              <div className="ps-3 colored1">
                <Link
                  to="/add-invoice"
                  ref={(el) => (navLinksRef.current[8] = el)}
                  style={navLinkStyle("/add-invoice")}
                  onClick={closeSidebar}
                >
                  Add New Billing
                </Link>
                <Link
                  to="/display-invoice"
                  ref={(el) => (navLinksRef.current[9] = el)}
                  style={navLinkStyle("/display-invoice")}
                  onClick={closeSidebar}
                >
                  View Billing
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/purchase"
            ref={(el) => (navLinksRef.current[10] = el)}
            style={navLinkStyle("/purchase")}
            onClick={closeSidebar}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                toggleDropdown("sales");
              }
            }}
            className="d-flex align-items-center gap-2"
          >
            <FiLayers /> Purchase Bill
          </Link>

          <div className="dropdown mt-2">
            <Link
              to="/report"
              ref={(el) => (navLinksRef.current[11] = el)}
              style={navLinkStyle("/report")}
              onClick={closeSidebar}
              className="d-flex align-items-center gap-2"
            >
              <FiLayers /> Receipt
            </Link>
          </div>

          <div className="dropdown mt-2">
            <Link
              to="/salesmanwindow"
              ref={(el) => (navLinksRef.current[12] = el)}
              style={navLinkStyle("/salesmanwindow")}
              onClick={closeSidebar}
              className="d-flex align-items-center gap-2"
            >
              <FiLayers /> SalesMan Window
            </Link>
          </div>

          <Link
            to="/test"
            ref={(el) => (navLinksRef.current[12] = el)}
            style={navLinkStyle("/test")}
            onClick={closeSidebar}
            className="d-flex align-items-center gap-2"
          >
            <FiLayers /> Payment
          </Link>

          <div className="dropdown mt-2">
            {/* <Link
              to="/modify-bill"
              ref={(el) => (navLinksRef.current[12] = el)}
              style={navLinkStyle("/salesmanwindow")}
              onClick={closeSidebar}
            > */}
            <button
              onClick={() => {
                openModifyBill();
                closeSidebar();
              }}
              // onClick={closeSidebar}
              className="btn text-white w-100 text-start d-flex align-items-center gap-2"
            >
              <FiLayers /> Modify Bill
            </button>
            {/* </Link> */}
          </div>

          <div className="dropdown mt-2">
            <button
              onClick={() => toggleDropdown("ledger")}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  toggleDropdown("ledger");
                }
                if (e.key === "ArrowUp") {
                  toggleDropdown("modifybill");
                }
              }}
              className="btn text-white w-100 text-start d-flex align-items-center gap-2"
              ref={(el) => (navLinksRef.current[14] = el)}
            >
              <FiLayers /> Ledger <FiChevronDown size={12} />
            </button>
            {openDropdown === "ledger" && (
              <div className="ps-3 colored2">
                <Link
                  to="/ledger"
                  ref={(el) => (navLinksRef.current[15] = el)}
                  style={navLinkStyle("/ledger")}
                  onClick={closeSidebar}
                >
                  Customer Ledger
                </Link>
                <Link
                  to="/vendor-ledger"
                  ref={(el) => (navLinksRef.current[16] = el)}
                  style={navLinkStyle("/vendor-ledger")}
                  onClick={closeSidebar}
                >
                  Vendor Ledger
                </Link>
              </div>
            )}
          </div>

          <div className="dropdown mt-2">
            <Link
              to="/outstanding"
              ref={(el) => (navLinksRef.current[17] = el)}
              style={navLinkStyle("/outstanding")}
              onClick={closeSidebar}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") {
                  toggleDropdown("ledger");
                }
              }}
            >
              <FiLayers /> Outstanding
            </Link>
          </div>

          <div className="dropdown mt-2">
            <button
              onClick={() => toggleDropdown("stockstatus")}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  toggleDropdown("stockstatus");
                }
              }}
              className="btn text-white w-100 text-start d-flex align-items-center gap-2"
              ref={(el) => (navLinksRef.current[18] = el)}
            >
              <FiLayers /> Stock Status <FiChevronDown size={12} />
            </button>
          </div>

          <div className="dropdown mt-2">
            <button
              onClick={() => toggleDropdown("stocksale")}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  toggleDropdown("stocksale");
                }
                if (e.key === "ArrowUp") {
                  toggleDropdown("stockstatus");
                }
              }}
              className="btn text-white w-100 text-start d-flex align-items-center gap-2"
              ref={(el) => (navLinksRef.current[19] = el)}
            >
              <FiLayers /> Stock And Sale Analysis <FiChevronDown size={12} />
            </button>
          </div>

          <div className="dropdown mt-2">
            <button
              onClick={() => toggleDropdown("dispatch")}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  setOpenDropdown("dispatch");
                }
                if (e.key === "ArrowUp") {
                  toggleDropdown("stocksale");
                }
              }}
              className="btn text-white w-100 text-start d-flex align-items-center gap-2"
              ref={(el) => (navLinksRef.current[20] = el)}
            >
              <FiLayers /> Dispatch Summary <FiChevronDown size={12} />
            </button>
          </div>

          <Link
            to="#"
            ref={(el) => (navLinksRef.current[21] = el)}
            style={navLinkStyle("/")}
            onClick={closeSidebar}
            className="d-flex align-items-center gap-2"
          >
            <FiLayers /> Today Gross Profit
          </Link>

          <div className="dropdown mt-2">
            <button
              onClick={() => toggleDropdown("billing")}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  toggleDropdown("billing");
                }
              }}
              className="btn text-white w-100 text-start d-flex align-items-center gap-2"
              ref={(el) => (navLinksRef.current[22] = el)}
            >
              <FiLayers /> Billing <FiChevronDown size={12} />
            </button>
          </div>

          <div className="dropdown mt-2">
            <button
              onClick={() => toggleDropdown("report")}
              onKeyDown={(e) => {
                if (e.key === "Arrowdown") {
                  setOpenDropdown("report");
                }
                if (e.key === "ArrowUp") {
                  toggleDropdown("billing");
                }
              }}
              className="btn text-white w-100 text-start d-flex align-items-center gap-2"
              ref={(el) => (navLinksRef.current[23] = el)}
            >
              <FiLayers /> Report <FiChevronDown size={12} />
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbarfrist;
