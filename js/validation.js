/* ==========================================================================
   Reusable form validation
   Each rule returns an error message, or "" when the value is valid.
   createValidator() wires rules to a form with real-time inline errors.
   ========================================================================== */

const Rules = {
  required: (label) => (value) => (value.trim() ? "" : `Please enter your ${label}.`),

  requiredChoice: (label) => (value) => (value ? "" : `Please choose ${label}.`),

  name: (value) => {
    const v = value.trim();
    if (!v) return "Please enter your full name.";
    if (v.length < 2) return "Your name must be at least 2 characters.";
    if (!/^[A-Za-zÀ-ÿ' -]+$/.test(v)) return "Your name can only contain letters, spaces, hyphens and apostrophes.";
    if (!/\s/.test(v)) return "Please enter your name and surname.";
    return "";
  },

  email: (value) => {
    const v = value.trim();
    if (!v) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Please enter a valid email address, e.g. name@example.co.za.";
    return "";
  },

  // South African numbers: 0XX XXX XXXX or +27 XX XXX XXXX
  saPhone: (value) => {
    const v = value.replace(/[\s()-]/g, "");
    if (!v) return "Please enter your phone number.";
    if (!/^(?:\+27|0)[1-8]\d{8}$/.test(v)) return "Please enter a valid South African number, e.g. 071 234 5678 or +27 71 234 5678.";
    return "";
  },

  futureDate: (value) => {
    if (!value) return "Please choose a preferred date.";
    const chosen = new Date(value + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(chosen.getTime())) return "Please enter a valid date.";
    if (chosen < today) return "The date can't be in the past. Please choose today or a later date.";
    const limit = new Date(today);
    limit.setFullYear(limit.getFullYear() + 1);
    if (chosen > limit) return "Please choose a date within the next 12 months.";
    return "";
  },

  wholeNumber: (min, max, label) => (value) => {
    if (value === "") return `Please enter the number of ${label}.`;
    const n = Number(value);
    if (!Number.isInteger(n)) return "Please enter a whole number.";
    if (n < min) return `Please enter at least ${min}.`;
    if (n > max) return `The maximum is ${max}. Please contact us directly for larger requests.`;
    return "";
  },

  minLength: (min) => (value) => {
    const v = value.trim();
    if (!v) return "Please enter a message.";
    if (v.length < min) return `Your message must be at least ${min} characters (${min - v.length} more needed).`;
    return "";
  },

  checked: (message) => (_value, field) => (field.checked ? "" : message)
};

/**
 * Attach validation to a form.
 * @param {HTMLFormElement} form
 * @param {Object<string, Function|Function[]>} rules  keyed by field name
 * @returns {{ validateAll: () => boolean, reset: () => void }}
 */
function createValidator(form, rules) {
  const touched = new Set();

  const getRules = (name) => (Array.isArray(rules[name]) ? rules[name] : [rules[name]]);

  function showResult(field, message) {
    const group = field.closest(".form-group");
    const errorEl = document.getElementById(`${field.id}-error`);
    group.classList.toggle("invalid", Boolean(message));
    group.classList.toggle("valid", !message);
    field.setAttribute("aria-invalid", String(Boolean(message)));
    if (errorEl) errorEl.textContent = message;
  }

  function validateField(field) {
    for (const rule of getRules(field.name)) {
      const message = rule(field.value, field);
      if (message) {
        showResult(field, message);
        return false;
      }
    }
    showResult(field, "");
    return true;
  }

  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    if (!field) return;

    // Validate when leaving a field, then live while correcting it
    field.addEventListener("blur", () => {
      touched.add(name);
      validateField(field);
    });
    const live = () => {
      if (touched.has(name)) validateField(field);
    };
    field.addEventListener("input", live);
    field.addEventListener("change", () => {
      touched.add(name);
      validateField(field);
    });
  });

  return {
    validateField,
    validateAll() {
      let firstInvalid = null;
      Object.keys(rules).forEach((name) => {
        const field = form.elements[name];
        if (!field) return;
        touched.add(name);
        if (!validateField(field) && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) firstInvalid.focus();
      return !firstInvalid;
    },
    reset() {
      touched.clear();
      form.querySelectorAll(".form-group").forEach((g) => g.classList.remove("valid", "invalid"));
      form.querySelectorAll("[aria-invalid]").forEach((f) => f.removeAttribute("aria-invalid"));
      form.querySelectorAll(".error-message").forEach((e) => (e.textContent = ""));
    }
  };
}

/* Live character counter for a textarea */
function attachCharCounter(textarea, counterEl, min) {
  const update = () => {
    const len = textarea.value.trim().length;
    counterEl.textContent = len < min ? `${len} / ${min} characters minimum` : `${len} characters ✓`;
  };
  textarea.addEventListener("input", update);
  update();
  return update;
}

/* Send form data to Formspree. Resolves on success, rejects with a message. */
async function sendToFormspree(data) {
  if (!isEmailConfigured()) {
    throw new Error("The email service has not been set up yet.");
  }
  const response = await fetch(SITE_CONFIG.formspreeEndpoint, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const detail = body.errors ? body.errors.map((e) => e.message).join(", ") : `status ${response.status}`;
    throw new Error(`The message could not be sent (${detail}).`);
  }
}
