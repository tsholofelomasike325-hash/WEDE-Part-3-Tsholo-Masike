/* ==========================================================================
   Contact page - validation and sending email through Formspree.
   Depends on: config.js, validation.js
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const feedback = document.getElementById("contact-feedback");
  const submitBtn = form.querySelector("button[type=submit]");

  const validator = createValidator(form, {
    contactName: Rules.name,
    contactEmail: Rules.email,
    contactPhone: Rules.saPhone,
    subject: Rules.requiredChoice("a subject"),
    contactMessage: Rules.minLength(20)
  });

  const updateCounter = attachCharCounter(form.elements.contactMessage, document.getElementById("contactMessage-count"), 20);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    feedback.hidden = true;

    if (!validator.validateAll()) {
      show("error", "<h3>Please check the highlighted fields</h3><p>Fix the fields marked in red and try again.</p>");
      return;
    }

    // Bots fill the hidden honeypot field; real visitors never see it
    if (form.elements._gotcha.value) return;

    const name = form.elements.contactName.value.trim();
    const subject = form.elements.subject.value;

    setLoading(true);
    try {
      await sendToFormspree({
        _subject: `Website contact: ${subject}`,
        _replyto: form.elements.contactEmail.value.trim(),
        name,
        email: form.elements.contactEmail.value.trim(),
        phone: form.elements.contactPhone.value.trim(),
        subject,
        message: form.elements.contactMessage.value.trim()
      });
      show("success", `<h3>Message sent. Thank you, ${escapeText(name.split(" ")[0])}!</h3>
        <p>We've received your message about <strong>${escapeText(subject)}</strong> and will reply to
        <strong>${escapeText(form.elements.contactEmail.value.trim())}</strong> within 2 working days.</p>`);
      form.reset();
      validator.reset();
      updateCounter();
    } catch (err) {
      show("error", `<h3>Sorry, your message wasn't sent</h3>
        <p>${escapeText(err.message)} Your details are still in the form, so please try again,
        or email us directly at <a href="mailto:info@dobsonvillefoundation.org.za">info@dobsonvillefoundation.org.za</a>.</p>`);
    } finally {
      setLoading(false);
    }
  });

  function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.setAttribute("aria-busy", String(loading));
    submitBtn.innerHTML = loading ? '<span class="spinner" aria-hidden="true"></span> Sending…' : "Send message";
  }

  function show(kind, html) {
    feedback.className = `form-feedback ${kind}`;
    feedback.innerHTML = html;
    feedback.hidden = false;
    feedback.focus({ preventScroll: true });
    feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function escapeText(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
});
