/* ==========================================================================
   Enquiry page - validation, cost/availability calculation and response.
   Depends on: data.js (PROGRAMMES), config.js, validation.js
   ========================================================================== */

const ENQUIRY_TYPES = {
  programme: {
    label: "Join a programme",
    qtyLabel: "Number of participants",
    qtyNoun: "participants",
    hint: "How many people (including you) would like to join?",
    min: 1, max: 10, days: "weekdays", noticeDays: 0
  },
  food: {
    label: "Food parcel request",
    qtyLabel: "People in your household",
    qtyNoun: "people in your household",
    hint: "We use this to work out how many parcels your household needs.",
    min: 1, max: 15, days: "weekdays", noticeDays: 0
  },
  volunteer: {
    label: "Volunteer with us",
    qtyLabel: "Number of volunteers",
    qtyNoun: "volunteers",
    hint: "Coming as a group or company team? Tell us how many.",
    min: 1, max: 30, days: "weekdays-saturday", noticeDays: 2
  },
  sponsorship: {
    label: "Sponsor skills learners",
    qtyLabel: "Number of learners to sponsor",
    qtyNoun: "learners",
    hint: "R3 500 trains one unemployed young person.",
    min: 1, max: 200, days: "weekdays", noticeDays: 0, unitCost: 3500
  },
  "food-sponsor": {
    label: "Fund food parcels",
    qtyLabel: "Number of food parcels",
    qtyNoun: "food parcels",
    hint: "R450 feeds a family of four for a month.",
    min: 1, max: 1000, days: "weekdays", noticeDays: 0, unitCost: 450
  },
  venue: {
    label: "Hire the community centre",
    qtyLabel: "Number of guests",
    qtyNoun: "guests",
    hint: "Our hall seats up to 120 guests.",
    min: 1, max: 120, days: "weekdays-saturday", noticeDays: 7
  }
};

// Fixed-date South African public holidays (month-day) when the centre is closed
const PUBLIC_HOLIDAYS = ["01-01", "03-21", "04-27", "05-01", "06-16", "08-09", "09-24", "12-16", "12-25", "12-26"];

const rand = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 });
const longDate = (d) => d.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("enquiry-form");
  if (!form) return;

  const typeSelect = form.elements.enquiryType;
  const programmeGroup = document.getElementById("programme-group");
  const programmeSelect = form.elements.programme;
  const orgGroup = document.getElementById("organisation-group");
  const qtyInput = form.elements.quantity;
  const qtyLabel = document.getElementById("quantity-label");
  const qtyHint = document.getElementById("quantity-hint");
  const dateInput = form.elements.preferredDate;
  const feedback = document.getElementById("enquiry-feedback");
  const submitBtn = form.querySelector("button[type=submit]");

  // Fill dropdowns from data
  Object.entries(ENQUIRY_TYPES).forEach(([value, t]) => typeSelect.add(new Option(t.label, value)));
  PROGRAMMES.forEach((p) => programmeSelect.add(new Option(p.title, p.id)));

  // Don't let the date picker offer past dates
  dateInput.min = toInputDate(new Date());

  const validator = createValidator(form, {
    fullName: Rules.name,
    email: Rules.email,
    phone: Rules.saPhone,
    enquiryType: Rules.requiredChoice("an enquiry type"),
    programme: (value) => (typeSelect.value === "programme" && !value ? "Please choose a programme." : ""),
    preferredDate: Rules.futureDate,
    quantity: (value) => {
      const t = ENQUIRY_TYPES[typeSelect.value];
      return t ? Rules.wholeNumber(t.min, t.max, t.qtyNoun)(value) : Rules.wholeNumber(1, 1000, "people")(value);
    },
    message: Rules.minLength(20),
    consent: Rules.checked("Please agree so we can contact you about your enquiry.")
  });

  const updateCounter = attachCharCounter(form.elements.message, document.getElementById("message-count"), 20);

  typeSelect.addEventListener("change", applyType);

  function applyType() {
    const t = ENQUIRY_TYPES[typeSelect.value];
    programmeGroup.hidden = typeSelect.value !== "programme";
    orgGroup.hidden = !["sponsorship", "food-sponsor", "venue", "volunteer"].includes(typeSelect.value);
    qtyLabel.firstChild.textContent = t ? t.qtyLabel + " " : "Number of people ";
    qtyHint.textContent = t ? t.hint : "Choose an enquiry type first.";
    qtyInput.min = t ? t.min : 1;
    qtyInput.max = t ? t.max : 1000;
    if (qtyInput.value) validator.validateField(qtyInput);
  }

  // Pre-select from links such as enquiry.html?type=programme&programme=food-parcels
  const params = new URLSearchParams(window.location.search);
  if (ENQUIRY_TYPES[params.get("type")]) typeSelect.value = params.get("type");
  if (PROGRAMMES.some((p) => p.id === params.get("programme"))) programmeSelect.value = params.get("programme");
  applyType();

  form.addEventListener("reset", () => {
    validator.reset();
    // Wait for the browser to clear the fields before refreshing dependent UI
    setTimeout(() => { applyType(); updateCounter(); });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validator.validateAll()) {
      showFeedback("error", "<h3>Please check the highlighted fields</h3><p>Some details are missing or incorrect. Fix the fields marked in red and try again.</p>", false);
      return;
    }

    const data = collect();
    const result = calculate(data);
    const reference = makeReference();

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Processing…';

    // Send a copy to the foundation's inbox when email is set up
    let emailNote = "";
    if (isEmailConfigured()) {
      try {
        await sendToFormspree({ _subject: `New enquiry ${reference}: ${data.typeLabel}`, reference, ...data, estimate: result.headline });
        emailNote = `<p>A copy has been sent to our team and to our records under reference <strong>${reference}</strong>.</p>`;
      } catch (err) {
        emailNote = `<p><strong>Note:</strong> ${escapeHtml(err.message)} Please keep your reference number <strong>${reference}</strong> and call us if you don't hear back within 3 working days.</p>`;
      }
    } else {
      emailNote = `<p>Your reference number is <strong>${reference}</strong>.</p>`;
    }

    showFeedback("success", renderSummary(data, result, emailNote), true);
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit enquiry";
  });

  function collect() {
    const t = ENQUIRY_TYPES[typeSelect.value];
    const programme = PROGRAMMES.find((p) => p.id === programmeSelect.value);
    return {
      name: form.elements.fullName.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      organisation: orgGroup.hidden ? "" : form.elements.organisation.value.trim(),
      type: typeSelect.value,
      typeLabel: t.label,
      programme: typeSelect.value === "programme" && programme ? programme.title : "",
      date: dateInput.value,
      quantity: Number(qtyInput.value),
      message: form.elements.message.value.trim()
    };
  }

  function showFeedback(kind, html, scroll) {
    feedback.className = `form-feedback ${kind}`;
    feedback.innerHTML = html;
    feedback.hidden = false;
    if (scroll) {
      feedback.scrollIntoView({ behavior: "smooth", block: "start" });
      feedback.focus({ preventScroll: true });
    }
  }
});

/* ---------- Calculations ---------- */

function calculate(data) {
  const t = ENQUIRY_TYPES[data.type];
  const requested = new Date(data.date + "T00:00:00");
  const available = nextAvailableDate(requested, t);
  const sameDay = available.getTime() === requested.getTime();
  const qty = data.quantity;
  let headline = "";
  const lines = [];

  switch (data.type) {
    case "programme":
      headline = "Free of charge";
      lines.push(`${qty} ${qty === 1 ? "place" : "places"} requested in <strong>${escapeHtml(data.programme)}</strong>. Community programmes are free for participants.`);
      lines.push("Please bring a copy of your ID or birth certificate when you register.");
      break;
    case "food": {
      const parcels = Math.ceil(qty / 4);
      headline = `${parcels} food ${parcels === 1 ? "parcel" : "parcels"} per month`;
      lines.push(`A household of ${qty} would be assessed for <strong>${parcels} ${parcels === 1 ? "parcel" : "parcels"}</strong> a month (each parcel feeds about four people).`);
      lines.push("Food support is free. Please bring proof of address for the eligibility check.");
      break;
    }
    case "volunteer": {
      const hours = qty * 3;
      headline = `${hours} volunteer hours`;
      lines.push(`${qty} ${qty === 1 ? "volunteer" : "volunteers"} on a standard 3-hour shift gives the community <strong>${hours} hours</strong> of support.`);
      if (qty >= 10) lines.push("Groups of 10 or more are ideal for a food parcel packing day. We'll plan one with you.");
      break;
    }
    case "sponsorship": {
      const total = qty * t.unitCost;
      headline = rand.format(total);
      lines.push(`${qty} × ${rand.format(t.unitCost)} per learner = <strong>${rand.format(total)}</strong>.`);
      lines.push(`This level of support matches our <strong>${suggestTier(total)}</strong> package.`);
      break;
    }
    case "food-sponsor": {
      const total = qty * t.unitCost;
      headline = rand.format(total);
      lines.push(`${qty} × ${rand.format(t.unitCost)} per parcel = <strong>${rand.format(total)}</strong>, feeding about <strong>${qty * 4} people</strong> for a month.`);
      lines.push(`This level of support matches our <strong>${suggestTier(total)}</strong> package.`);
      break;
    }
    case "venue": {
      const total = qty <= 50 ? 1500 : 2500;
      headline = rand.format(total);
      lines.push(`Half-day hall hire for ${qty} ${qty === 1 ? "guest" : "guests"}: <strong>${rand.format(total)}</strong> (${qty <= 50 ? "small" : "large"} hall rate, includes chairs and tables).`);
      lines.push("A 50% deposit confirms the booking. Hire income goes straight back into our programmes.");
      break;
    }
  }

  const availability = sameDay
    ? `<strong>${longDate(available)}</strong> is available.`
    : `The centre isn't available for this on ${longDate(requested)}${unavailableReason(requested, t)}. The next available date is <strong>${longDate(available)}</strong>.`;

  return { headline, lines, availability };
}

function suggestTier(total) {
  if (total >= 75000) return "Anchor Sponsor";
  if (total >= 25000) return "Programme Partner";
  if (total >= 5000) return "Community Friend";
  return "individual donor";
}

function isOpenFor(date, t) {
  const day = date.getDay();
  const md = String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
  if (PUBLIC_HOLIDAYS.includes(md) || day === 0) return false;
  if (day === 6) return t.days === "weekdays-saturday";
  return true;
}

function earliestAllowed(t) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + t.noticeDays);
  return d;
}

function nextAvailableDate(requested, t) {
  const d = new Date(Math.max(requested, earliestAllowed(t)));
  while (!isOpenFor(d, t)) d.setDate(d.getDate() + 1);
  return d;
}

function unavailableReason(date, t) {
  if (date < earliestAllowed(t)) return ` (we need ${t.noticeDays} days' notice)`;
  const md = String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
  if (PUBLIC_HOLIDAYS.includes(md)) return " (public holiday)";
  if (date.getDay() === 0) return " (we are closed on Sundays)";
  if (date.getDay() === 6) return " (this service runs on weekdays only)";
  return "";
}

/* ---------- Output helpers ---------- */

function renderSummary(d, r, emailNote) {
  const first = escapeHtml(d.name.split(" ")[0]);
  return `
    <h3>Thank you, ${first}! Your enquiry has been received.</h3>
    <p class="estimate">${r.headline}</p>
    ${r.lines.map((l) => `<p>${l}</p>`).join("")}
    <p>${r.availability}</p>
    <ul class="summary-list">
      <li><strong>Enquiry:</strong> ${escapeHtml(d.typeLabel)}${d.programme ? ` – ${escapeHtml(d.programme)}` : ""}</li>
      ${d.organisation ? `<li><strong>Organisation:</strong> ${escapeHtml(d.organisation)}</li>` : ""}
      <li><strong>Contact:</strong> ${escapeHtml(d.email)} · ${escapeHtml(d.phone)}</li>
      <li><strong>Your message:</strong> ${escapeHtml(d.message)}</li>
    </ul>
    ${emailNote}
    <p>We'll contact you within <strong>2 working days</strong>. Estimates are a guide and will be confirmed by our team.</p>`;
}

function makeReference() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `DCF-${ymd}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function toInputDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
