import React, { useEffect, useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { HandCoins } from "lucide-react";
import { BadgePoundSterling } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { Receipt } from "lucide-react";
import { ScanSearch } from "lucide-react";
import { FilePlus2 } from "lucide-react";
import { Columns3Cog } from "lucide-react";
import { BriefcaseBusiness } from "lucide-react";

// or use your own modal implementation

function PopupModel() {
  const [showModal, setShowModal] = useState(false);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F4") {
        e.preventDefault();
        setShowModal((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleKeyDown = (e, index) => {
    const totalFields = inputRefs.current.length;
    const input = inputRefs.current[index];
    console.log(totalFields);
    console.log(input);

    const next = () => {
      const nextIndex = (index + 1) % totalFields;
      inputRefs.current[nextIndex]?.focus();
      setHoveredIndex(nextIndex); // 👈 mark as active
    };

    const prev = () => {
      const prevIndex = (index - 1 + totalFields) % totalFields;
      inputRefs.current[prevIndex]?.focus();
      setHoveredIndex(prevIndex); // 👈 mark as active
    };

    if (e.key === "Enter") {
      e.preventDefault();
      input?.click(); // 👈 simulate click to trigger Link navigation
      return;
    }

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }

    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  useEffect(() => {
    if (showModal) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
        setHoveredIndex(0);
      }, 0);
    }
  }, [showModal]);

  return (
    <>
      {/* Your routing or page components */}
      {/* Global modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Global F4 Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <p>This modal opens no matter where you are in the app 🎉</p> */}
          <div className="container">
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <Link to={"/outstanding"} className="text-decoration-none">
                  <div
                    tabIndex={0}
                    onMouseEnter={() => handleMouseEnter(0)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setShowModal(false)}
                    ref={(el) => (inputRefs.current[0] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 0)}
                    className={`box ${hoveredIndex === 0 ? "active" : ""}`}
                  >
                    <p className="m-0 px-3 py-1 color">
                      <span>
                        <BriefcaseBusiness />
                      </span>{" "}
                      OutStanding
                    </p>
                  </div>
                </Link>
              </div>
              <div className="col-12 col-md-4">
                <Link to={"/report"} className="text-decoration-none">
                  <div
                    tabIndex={1}
                    onMouseEnter={() => handleMouseEnter(1)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setShowModal(false)}
                    ref={(el) => (inputRefs.current[1] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 1)}
                    className={`box ${hoveredIndex === 1 ? "active" : ""}`}
                  >
                    <p className="m-0 p-3 color">
                      {" "}
                      <span>
                        <HandCoins />
                      </span>{" "}
                      Received
                    </p>
                  </div>
                </Link>
              </div>
              <div className="col-12 col-md-4">
                <Link to={"/test"} className="text-decoration-none">
                  <div
                    tabIndex={2}
                    onMouseEnter={() => handleMouseEnter(2)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setShowModal(false)}
                    ref={(el) => (inputRefs.current[2] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 2)}
                    className={`box ${hoveredIndex === 2 ? "active" : ""}`}
                  >
                    <p className="m-0 p-3 color">
                      {" "}
                      <span>
                        <BadgePoundSterling />
                      </span>{" "}
                      Payment
                    </p>
                  </div>
                </Link>
              </div>

              <div className="col-12 col-md-4">
                <Link to={"/purchase"} className="text-decoration-none">
                  <div
                    tabIndex={3}
                    onMouseEnter={() => handleMouseEnter(3)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setShowModal(false)}
                    ref={(el) => (inputRefs.current[3] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 3)}
                    className={`box ${hoveredIndex === 3 ? "active" : ""}`}
                  >
                    <p className="m-0 px-3 py-1 color">
                      {" "}
                      <span>
                        <Receipt />
                      </span>{" "}
                      Purchase bill
                    </p>
                  </div>
                </Link>
              </div>
              <div className="col-12 col-md-4">
                <Link to={"/add-customer"} className="text-decoration-none">
                  <div
                    tabIndex={4}
                    onMouseEnter={() => handleMouseEnter(4)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setShowModal(false)}
                    ref={(el) => (inputRefs.current[4] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 4)}
                    className={`box ${hoveredIndex === 4 ? "active" : ""}`}
                  >
                    <p className="m-0 p-3 color">
                      {" "}
                      <span>
                        <Columns3Cog />
                      </span>{" "}
                      Customer
                    </p>
                  </div>
                </Link>
              </div>
              <div className="col-12 col-md-4">
                <Link to={"/product"} className="text-decoration-none">
                  <div
                    tabIndex={5}
                    onMouseEnter={() => handleMouseEnter(5)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setShowModal(false)}
                    ref={(el) => (inputRefs.current[5] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 5)}
                    className={`box ${hoveredIndex === 5 ? "active" : ""}`}
                  >
                    <p className="m-0 p-3 color">
                      {" "}
                      <span>
                        <ShoppingCart />
                      </span>{" "}
                      Product
                    </p>
                  </div>
                </Link>
              </div>

              <div className="col-12 col-md-4">
                <Link to={"/add-invoice"} className="text-decoration-none">
                  <div
                    tabIndex={6}
                    onMouseEnter={() => handleMouseEnter(6)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setShowModal(false)}
                    ref={(el) => (inputRefs.current[6] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 6)}
                    className={`box ${hoveredIndex === 6 ? "active" : ""}`}
                  >
                    <p className="m-0 px-3 py-1 color">
                      {" "}
                      <span>
                        <FilePlus2 />
                      </span>{" "}
                      Add New Bill
                    </p>
                  </div>
                </Link>
              </div>
              <div className="col-12 col-md-4">
                <Link to={"/display-invoice"} className="text-decoration-none">
                  <div
                    tabIndex={7}
                    onMouseEnter={() => handleMouseEnter(7)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setShowModal(false)}
                    ref={(el) => (inputRefs.current[7] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 7)}
                    className={`box ${hoveredIndex === 7 ? "active" : ""}`}
                  >
                    <p className="m-0 p-3 color">
                      <span>
                        <ScanSearch />
                      </span>{" "}
                      View Bill
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PopupModel;

// PopupModel
