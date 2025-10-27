import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

const NameSelectModals = ({
  show,
  onHide,
  onSubmit,
  selectedType,
  selectedName,
  setSelectedName,
}) => {
  const mrList = useSelector((s) => s?.salesman?.salesmen || []);
  const areaList = useSelector((s) => s?.customer?.beats || []);

  const options =
    selectedType === "mrwise"
      ? mrList.map((mr) => ({ id: mr._id, name: mr.name }))
      : areaList.map((a) => ({ id: a.areaId, name: a.areaName || a.name }));

  const [highlightIndex, setHighlightIndex] = useState(-1);
  const formRef = useRef(null);

  // Initialize highlight & selection when modal opens or list changes
  useEffect(() => {
    if (!show) return;
    if (!options.length) {
      setHighlightIndex(-1);
      return;
    }
    const idx = selectedName
      ? Math.max(
          0,
          options.findIndex((o) => o.id === selectedName.id)
        )
      : 0;

    setHighlightIndex(idx);
    setSelectedName(options[idx]); // ← arrow navigation should reflect actual selection
  }, [show, selectedType, options.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard: Up/Down selects immediately; Enter submits; Esc closes
  useEffect(() => {
    if (!show) return;

    const handleKey = (e) => {
      if (!options.length) return;

      if (e.key === "Escape") {
        onHide();
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((prev) => {
          const next = prev < options.length - 1 ? prev + 1 : 0;
          setSelectedName(options[next]); // ← select on move
          return next;
        });
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((prev) => {
          const next = prev > 0 ? prev - 1 : options.length - 1;
          setSelectedName(options[next]); // ← select on move
          return next;
        });
      }

      if (e.key === "Enter") {
        e.preventDefault();
        // submit with current selection
        formRef.current?.requestSubmit();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [show, options, onHide, setSelectedName]);

  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Select {selectedType === "mrwise" ? "MR Name" : "Area Name"}
        </Modal.Title>
      </Modal.Header>

      <form ref={formRef} onSubmit={onSubmit}>
        <Modal.Body>
          <ListGroup>
            {options.map((opt, idx) => (
              <ListGroup.Item
                key={opt.id}
                as="button"
                type="button"
                action
                active={highlightIndex === idx}
                onClick={() => {
                  setHighlightIndex(idx);
                  setSelectedName(opt); // click selects
                }}
              >
                {opt.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Back
          </Button>
          <Button variant="primary" type="submit" disabled={!selectedName}>
            Show Data
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default NameSelectModals;
