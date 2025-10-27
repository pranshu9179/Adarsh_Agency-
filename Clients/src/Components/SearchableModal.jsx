import { useState, useEffect, useRef } from "react";

const useSearchableModal = (items, filterKey) => {
  const [showModal, setShowModal] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const rowRefs = useRef([]);

  const filteredItems = items.filter((item) =>
    item[filterKey]?.toLowerCase().includes(filterText.toLowerCase())
  );

  // Focus first item when modal opens
  useEffect(() => {
    if (showModal) {
      setFocusedIndex(-1);
      setFilterText("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showModal]);

  // Focus the focusedIndex item on change
  useEffect(() => {
    if (focusedIndex >= 0 && focusedIndex < filteredItems.length) {
      rowRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, filteredItems.length]);

  // Close modal on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  return {
    showModal,
    setShowModal,
    filterText,
    setFilterText,
    focusedIndex,
    setFocusedIndex,
    modalRef,
    inputRef,
    rowRefs,
    filteredItems,
  };
};

export default useSearchableModal;
