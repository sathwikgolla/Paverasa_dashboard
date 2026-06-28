function requiredString(value, fieldName, errors) {
  if (typeof value !== "string" || value.trim() === "") {
    errors[fieldName] = `${fieldName} is required.`;
    return "";
  }

  return value.trim();
}

function optionalString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function requiredDate(value, fieldName, errors) {
  const date = requiredString(value, fieldName, errors);

  if (date && Number.isNaN(Date.parse(date))) {
    errors[fieldName] = `${fieldName} must be a valid date.`;
  }

  return date;
}

function requiredAmount(value, fieldName, errors) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    errors[fieldName] = `${fieldName} must be greater than 0.`;
    return 0;
  }

  return amount;
}

export function validateRevenuePayload(payload) {
  const errors = {};

  const data = {
    date: requiredDate(payload.date, "date", errors),
    client_name: requiredString(payload.client_name, "client_name", errors),
    service_name: requiredString(payload.service_name, "service_name", errors),
    department: requiredString(payload.department, "department", errors),
    amount: requiredAmount(payload.amount, "amount", errors),
    payment_mode: requiredString(payload.payment_mode, "payment_mode", errors),
    payment_status: requiredString(
      payload.payment_status,
      "payment_status",
      errors,
    ),
    invoice_number: requiredString(
      payload.invoice_number,
      "invoice_number",
      errors,
    ),
    notes: optionalString(payload.notes),
  };

  return {
    data,
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

export function validateExpensePayload(payload) {
  const errors = {};

  const data = {
    date: requiredDate(payload.date, "date", errors),
    category: requiredString(payload.category, "category", errors),
    vendor: requiredString(payload.vendor, "vendor", errors),
    amount: requiredAmount(payload.amount, "amount", errors),
    payment_mode: requiredString(payload.payment_mode, "payment_mode", errors),
    notes: optionalString(payload.notes),
  };

  return {
    data,
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function validateRegisterPayload(payload, allowedRoles) {
  const errors = {};

  const name =
    typeof payload.name === "string" && payload.name.trim()
      ? payload.name.trim()
      : "";
  const email =
    typeof payload.email === "string" && payload.email.trim()
      ? payload.email.trim().toLowerCase()
      : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  const confirmPassword =
    typeof payload.confirmPassword === "string" ? payload.confirmPassword : "";
  const role =
    typeof payload.role === "string" && payload.role.trim()
      ? payload.role.trim()
      : "";

  if (!name) {
    errors.name = "Full name is required.";
  }

  if (!email) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm password is required.";
  } else if (password && password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!role) {
    errors.role = "Please select a role.";
  } else if (!allowedRoles.includes(role)) {
    errors.role = "Selected role is not available for registration.";
  }

  return {
    data: {
      name,
      email,
      password,
      confirmPassword,
      role,
    },
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}
