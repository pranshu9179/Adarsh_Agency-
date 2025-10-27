export const handleFormNavigation = (
  e,
  focusableSelector = "input, select, .react-select__input input"
) => {
  const form = e.target.form;
  const focusable = Array.from(form.querySelectorAll(focusableSelector)).filter(
    (el) => !el.disabled
  );

  const index = focusable.indexOf(e.target);

  if (e.key === "Enter") {
    e.preventDefault();
    if (index >= 0 && focusable[index + 1]) {
      focusable[index + 1].focus();
    }
  }

  if (e.key === "Escape") {
    e.preventDefault();
    if (index > 0 && focusable[index - 1]) {
      focusable[index - 1].focus();
    }
  }
};

export const handleReactSelectKeyDown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const menuOptions = document.querySelectorAll(
      ".react-select__menu .react-select__option"
    );
    const focusedOption = Array.from(menuOptions).find((el) =>
      el.classList.contains("react-select__option--is-focused")
    );
    if (focusedOption) {
      focusedOption.click();
    }

    setTimeout(() => handleFormNavigation(e), 0);
  }

  if (e.key === "Escape") {
    e.preventDefault();
    handleFormNavigation(e);
  }
};
