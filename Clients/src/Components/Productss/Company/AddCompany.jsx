import { useEffect, useState, useRef } from "react";
import { FaCheck } from "react-icons/fa";
import axios from "../../../Config/axios";
import Loader from "../../Loader";
import toast from "react-hot-toast";

const AddCompany = ({
  brandNameRef,
  fetchCompanies,
  setActiveTab,
  edit,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const internalNameRef = useRef(null);
  const nameRef = brandNameRef || internalNameRef;

  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a company name");
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setLoading(true);

    try {
      const gstNumber = "GST-" + Math.random().toString(36).substring(2, 12);

      if (!edit) {
        // Create company
        const res = await axios.post("/company", {
          name,
          gstNumber,
        });
        console.log(res);

        setSubmitSuccess(true);
        toast.success("Company created successfully!");

        // reset input
        setName("");

        // refresh parent data
        if (fetchCompanies) fetchCompanies();

        // switch back to view tab
        if (setActiveTab) setActiveTab("view");

        // notify parent to reset edit state
        if (onSuccess) onSuccess();

        // refocus input
        setTimeout(() => {
          if (nameRef.current) nameRef.current.focus();
        }, 50);
      } else {
        // Update company
        const res = await axios.put(`/company/${edit._id}`, {
          name,
          gstNumber,
        });
        console.log(res);

        if (res.data?.status) {
          setSubmitSuccess(true);
          toast.success("Company updated successfully!");

          // reset input
          setName("");

          // refresh parent data
          if (fetchCompanies) fetchCompanies();

          // switch back to view tab
          if (setActiveTab) setActiveTab("view");

          // notify parent to reset edit state
          if (onSuccess) onSuccess();

          // refocus input
          setTimeout(() => {
            if (nameRef.current) nameRef.current.focus();
          }, 50);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error ||
          `Failed to ${edit ? "Update" : "Create"} company`
      );
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    // set input value when edit changes
    if (edit) {
      setName(edit.name);
    } else {
      setName(""); // reset input when no edit
    }
  }, [edit]);

  // Autofocus on mount
  useEffect(() => {
    setTimeout(() => {
      if (nameRef.current) nameRef.current.focus();
    }, 50);
  }, [nameRef]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h3 className="card-title">
            {edit ? "Update Company" : "Create Company"}
          </h3>
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

        <form id="add-company-form" onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="font-weight-bold">Company Name</label>
                  <input
                    id="company-name-input"
                    name="name"
                    className="form-control"
                    placeholder="Enter company name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    ref={nameRef}
                    autoComplete="off"
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
                  <FaCheck className="mr-2" />{" "}
                  {edit ? "Company Updated!" : "Company Created Successfully!"}
                </>
              ) : edit ? (
                "Update Company"
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

export default AddCompany;
