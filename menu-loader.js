// Load the menu from menu.html and insert it into the placeholder div
document.addEventListener("DOMContentLoaded", function () {
  fetch("menu.html")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load menu: " + response.status);
      }
      return response.text();
    })
    .then(function (menuHTML) {
      const placeholder = document.getElementById("menu-placeholder");
      if (placeholder) {
        placeholder.innerHTML = menuHTML;
      } else {
        console.warn("No element with ID 'menu-placeholder' found.");
      }
    })
    .catch(function (error) {
      console.error("Error loading menu:", error);
    });
});
