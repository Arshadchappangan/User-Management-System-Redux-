export const types = {
  CHANGE_FIELD: "CHANGE_FIELD",
  VALIDATE_FIELD: "VALIDATE_FIELD",
  SET_ERROR: 'SET_ERROR',
  RESET_FORM: "RESET_FORM",
};

export const initialState = {
  form: { name: "", email: "", password: "", confirmPassword: "" },
  errors: { name: "", email: "", password: "", confirmPassword: "" },
};


export const reducer = (state, action) => {
  switch (action.type) {
    case types.CHANGE_FIELD:
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value },
      };

    case types.VALIDATE_FIELD:
      const { field, value } = action;
      let message = "";

      if (field === "name") {
        if (!value || value.trim().length < 3)
          message = "Please enter full name (min 3 characters)";
      }

      if (field === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) message = "Email is required";
        else if (!emailRegex.test(value))
          message = "Please enter a valid email address";
      }

      if (field === "password") {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!value.trim()) message = "Password is required";
        else if (!passwordRegex.test(value))
          message =
            "Password must be at least 8 characters and include upper, lower and a number";
      }

      if (field === "confirmPassword") {
        if (!value) message = "Please confirm your password";
        else if (value !== state.form.password)
          message = "Passwords do not match";
      }

      return {
        ...state,
        errors: { ...state.errors, [field]: message },
      };

    case types.SET_ERROR:
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.message }
      }

    case types.RESET_FORM:
      return initialState;

    default:
      return state;
  }
};