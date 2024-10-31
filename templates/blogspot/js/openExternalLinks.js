document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        // Check if the link's href attribute starts with "http" or "https"
        if (link.href.startsWith('http') || link.href.startsWith('https')) {
            // If it's an external link, set target="_blank"
            link.target = '_blank';
        }
    });
});