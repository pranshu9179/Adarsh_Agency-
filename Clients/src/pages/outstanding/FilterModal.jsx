import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import dayjs from "dayjs";

const FilterModal = ({
  show,
  onHide,
  onSubmit,
  selectedType,
  setSelectedType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  useEffect(() => {
    if (!endDate) {
      const today = dayjs().format("YYYY-MM-DD");
      setEndDate(today);
    }
  }, [endDate, setEndDate]);

  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Type & Date</Modal.Title>
      </Modal.Header>
      <form onSubmit={onSubmit}>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Type</label>
            <div className="d-flex gap-2">
              <Button
                variant={
                  selectedType === "mrwise" ? "primary" : "outline-primary"
                }
                onClick={() => setSelectedType("mrwise")}
              >
                MR Wise
              </Button>
              <Button
                variant={
                  selectedType === "areawise" ? "primary" : "outline-primary"
                }
                onClick={() => setSelectedType("areawise")}
              >
                Area Wise
              </Button>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Start Date (Optional)</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">End Date (Optional)</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Next
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default FilterModal;
