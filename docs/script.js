document.getElementById('dark-button').addEventListener('click', () => {
    window.open('https://bsky.app/profile/romio.substack.com/feed/aaaomgpqdm7kg', '_blank', 'noopener noreferrer');
});

const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT_pOFYGEptIP4_cgLmzut__zFz8CQ95Q20kkTtY3RUxseFIjf4_bSkDeAVM8ZEsX4LSZYX5gqWGlg4/pub?gid=1680546202&single=true&output=csv';

fetch(sheetUrl)
    .then(response => response.text())
    .then(data => {
        console.log("Raw CSV Data:", data);

        const rows = data.split('\n').slice(1); // Skip the header row
        console.log("Parsed Rows:", rows);

        const container = document.getElementById('item-cards-container');

        rows.forEach(row => {
            if (row.trim() === '') return; // Skip empty rows

            const columns = parseCSVRow(row);
            if (columns.length < 7) {
                console.warn("Row with insufficient columns:", row);
                return;
            }

            const [itemType, itemHeading, itemDescription, scriptLink, botLink, extensionLink, frontendLink] = columns;

            const itemCard = document.createElement('div');
            itemCard.className = 'item-card';

            itemCard.innerHTML = ` 
                <p class="item-type">${itemType}</p>
                <div class="item-details">
                    <p class="item-heading">${itemHeading}</p>
                    <p class="paragraph-small">${itemDescription}</p>
                </div>
                <div class="item-links">
                    ${scriptLink ? `<a class="item-repo-link" href="${scriptLink}" target="_blank" rel="noopener noreferrer" aria-label="Script" title="Script">Script</a>` : ''}
                    ${botLink ? `<a class="item-repo-link" href="${botLink}" target="_blank" rel="noopener noreferrer" aria-label="Bot" title="Bot">Bot</a>` : ''}
                    ${extensionLink ? `<a class="item-repo-link" href="${extensionLink}" target="_blank" rel="noopener noreferrer" aria-label="Extension" title="Extension">Extension</a>` : ''}
                    ${frontendLink ? `<a class="item-repo-link" href="${frontendLink}" target="_blank" rel="noopener noreferrer" aria-label="Frontend" title="Frontend">Frontend</a>` : ''}
                </div>
            `;

            container.appendChild(itemCard);
        });
    })
    .catch(error => console.error('Error fetching or processing the data:', error));

// Alternative manual CSV parsing function
function parseCSVRow(row) {
    const columns = [];
    let currentColumn = "";
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
        const char = row[i];

        if (char === '"') {
            inQuotes = !inQuotes; 
        } else if (char === ',' && !inQuotes) {
            columns.push(currentColumn);
            currentColumn = "";
        } else {
            currentColumn += char;
        }
    }

    columns.push(currentColumn); // Add the last column
    return columns.map(col => col.trim()); // Trim whitespace from each column
}