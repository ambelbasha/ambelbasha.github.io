function openMenu(event, targetId) {
    event.preventDefault();  // Prevent the default anchor link behavior

    // Smooth scroll to the targeted section
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }
}
