function copyLinkToClipboard() {
    const currentLink = window.location.href;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(currentLink)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                fallbackCopy(currentLink);
            });
    } else {
        fallbackCopy(currentLink);
    }
}

function fallbackCopy(text) {
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = text;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);
    alert('Link copied to clipboard!');
}

const copyButton = document.getElementById('copy-link');
if (copyButton) {
    copyButton.addEventListener('click', copyLinkToClipboard);
}