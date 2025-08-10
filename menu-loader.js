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
      console.log("Menu HTML loaded:", menuHTML);
      const placeholder = document.getElementById("menu-placeholder");
      if (placeholder) {
        placeholder.innerHTML = menuHTML;

        // ✅ Inject page-specific content AFTER menu loads
        const rightContent = document.getElementById("top-bar-right-content");
        if (rightContent) {
          // Check current page
          const currentPage = window.location.pathname.split("/").pop();
          if (currentPage === "Numeration.html") {
            rightContent.innerHTML =
  '<a href="https://drive.google.com/file/d/17SrTJhh_6G9ASR8_0HBGJYMymkVyrYP5/view" target="_blank" ' +
  'style="text-decoration: none; font-weight: bold; color: #fff;">' +
  '📄 Sample – Numeration' +
  '</a>';
          }
        } else {
          console.warn("No element with ID 'top-bar-right-content' found in loaded menu.");
        }

      } else {
        console.warn("No element with ID 'menu-placeholder' found.");
      }
    })
    .catch(function (error) {
      console.error("Error loading menu:", error);}
    });
}}};
   
