
    // Function to toggle the visibility of the menu
    function toggleMenu() {
      const menu = document.getElementById("portfolio-menu");
      const burgerMenu = document.getElementById("portfolio-burger-menu");

      // Toggle the 'show' class to display/hide the menu
      menu.classList.toggle("show");

      // Toggle the 'open' class to animate the burger icon
      burgerMenu.classList.toggle("open");

      // Update the 'aria-expanded' attribute to reflect the state
      const isExpanded = burgerMenu.getAttribute("aria-expanded") === "true";
      burgerMenu.setAttribute("aria-expanded", !isExpanded);
    }
    window.addEventListener('load', () => {
    document.querySelector('.name-presentation h1').classList.add('visible');
});
