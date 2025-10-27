import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import axios from "../../Config/axios";

const AddFirm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    designation: "",
    city: "",
    address: "",
    mobile: "",
    alternateMobile: "",
    email: "",
    whatsapp: "",
    gstNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    try {
      const res = await axios.post("/firm", formData);
      console.log(res.data);
      setSubmitSuccess(true);
      // alert("Firm created successfully!");
      // Optionally reset form
      setFormData({
        name: "",
        contactPerson: "",
        designation: "",
        city: "",
        address: "",
        mobile: "",
        alternateMobile: "",
        email: "",
        whatsapp: "",
        gstNumber: "",
      });
    } catch (error) {
      console.error(error);
      // alert("Failed to create Firm");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h3 className="card-title">Create Firm</h3>
          <div className="card-tools">
            <button
              type="button"
              className="btn btn-tool"
              data-card-widget="collapse"
            >
              <i className="fas fa-minus"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label className="font-weight-bold">Firm Name</label>
                  <input
                    name="name"
                    className="form-control"
                    placeholder="Firm Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label className="font-weight-bold">
                    Contact Person Name
                  </label>
                  <input
                    name="contactPerson"
                    className="form-control"
                    placeholder="Contact Person Name"
                    value={formData.contactPerson}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label className="font-weight-bold">Designation</label>
                  <input
                    name="designation"
                    className="form-control"
                    placeholder="Designation"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label className="font-weight-bold">City</label>
                  <input
                    name="city"
                    className="form-control"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-8">
                <div className="form-group">
                  <label className="font-weight-bold">Address</label>
                  <input
                    name="address"
                    className="form-control"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label className="font-weight-bold">Mobile</label>
                  <input
                    name="mobile"
                    className="form-control"
                    placeholder="Mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label className="font-weight-bold">Alternate Mobile</label>
                  <input
                    name="alternateMobile"
                    className="form-control"
                    placeholder="Alternate Mobile"
                    value={formData.alternateMobile}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label className="font-weight-bold">Email</label>
                  <input
                    name="email"
                    className="form-control"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label className="font-weight-bold">WhatsApp No.</label>
                  <input
                    name="whatsapp"
                    className="form-control"
                    placeholder="WhatsApp No."
                    value={formData.whatsapp}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label className="font-weight-bold">GST No.</label>
                  <input
                    name="gstNumber"
                    className="form-control"
                    placeholder="GST No."
                    value={formData.gstNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card-footer text-center">
            <button
              type="submit"
              className="btn btn-success btn-lg px-5"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm mr-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Processing...
                </>
              ) : submitSuccess ? (
                <>
                  <FaCheck className="mr-2" /> Company Created Successfully!
                </>
              ) : (
                "Create Company"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFirm;
