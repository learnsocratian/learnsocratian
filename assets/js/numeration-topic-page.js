import { getNumerationPrice, formatPrice } from "/assets/js/pricing.js";

const CERTIFICATES_ENABLED = false;

function initializeCertificateFeature() {
  if (!CERTIFICATES_ENABLED) return;
  const section = document.querySelector("[data-certificate-section]");
  if (section) section.hidden = false;
}

function setPrices() {
  const topic = document.body.dataset.topic;

  document.querySelectorAll("[data-product]").forEach((button) => {
    const product = button.dataset.product;
    const price = getNumerationPrice(topic, product);

    if (price !== null) {
      button.textContent = `Buy ${formatPrice(price)}`;
      button.dataset.price = String(price);
    }
  });
}

function initializeDialogs() {
  document.querySelectorAll("[data-open-dialog]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      const dialog = document.getElementById(trigger.dataset.openDialog);
      if (dialog instanceof HTMLDialogElement) dialog.showModal();
    });
  });

  document.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = button.closest("dialog");
      if (dialog instanceof HTMLDialogElement) dialog.close();
    });
  });
}

function initializePracticePreviews() {
  const dialog = document.getElementById("practice-preview-dialog");
  const title = document.getElementById("practice-preview-title");
  const heading = document.getElementById("practice-preview-heading");

  document.querySelectorAll("[data-practice-preview]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const level = button.dataset.practicePreview;
      const topicName = document.body.dataset.topicName;

      if (title) title.textContent = `${topicName} — Level ${level} Preview`;
      if (heading) heading.textContent = `Level ${level} Practice Preview`;
      if (dialog instanceof HTMLDialogElement) dialog.showModal();
    });
  });
}

function initializePurchaseButtons() {
  document.querySelectorAll("[data-product]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      if (button.dataset.purchased === "true") {
        const target = button.dataset.viewer;
        const dialog = document.getElementById(target);

        if (dialog instanceof HTMLDialogElement) {
          dialog.showModal();
        }
        return;
      }

      // FUTURE:
      // Connect to payment flow.
      // After Firebase confirms purchase for the logged-in user:
      //   practice button text => "Practise!"
      //   assessment button text => "Start"
      alert("Purchase flow will be connected later.");
    });
  });
}

function initializeApp() {
  setPrices();
  initializeDialogs();
  initializePracticePreviews();
  initializePurchaseButtons();
  initializeCertificateFeature();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp, { once: true });
} else {
  initializeApp();
}
