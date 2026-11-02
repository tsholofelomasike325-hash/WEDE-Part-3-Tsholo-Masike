/* ==========================================================================
   Site configuration
   Paste your Formspree form endpoint below to make the contact and
   enquiry forms send real emails (see README > "How the forms work").
   Example: "https://formspree.io/f/xayzabcd"
   ========================================================================== */

const SITE_CONFIG = {
  formspreeEndpoint: "https://formspree.io/f/YOUR_FORM_ID"
};

function isEmailConfigured() {
  return !SITE_CONFIG.formspreeEndpoint.includes("YOUR_FORM_ID");
}
