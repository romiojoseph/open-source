const fs = require('fs');
const path = require('path');
const showdown = require('showdown');
const chokidar = require('chokidar');
const yaml = require('js-yaml');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const templateFilePath = './templates/post.html';
const outputFilePath = './demo.html';
let markdownFilePath = '';

const converter = new showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
});

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    return `${date.getDate()} ${date.toLocaleString('default', {
        month: 'short',
    })} ${date.getFullYear()} • ${formattedHours}:${minutes < 10 ? '0' + minutes : minutes
        } ${ampm}`;
}

function extractMetadata(markdownContent) {
    const metadataStartIndex = markdownContent.indexOf('---');
    const metadataEndIndex = markdownContent.indexOf('---', metadataStartIndex + 3);

    if (metadataStartIndex !== -1 && metadataEndIndex !== -1) {
        const metadataString = markdownContent.substring(metadataStartIndex + 3, metadataEndIndex);
        try {
            const metadata = yaml.load(metadataString);
            return metadata;
        } catch (error) {
            console.error('Error parsing YAML front matter:', error);
            return {}; // Return an empty object if parsing fails
        }
    } else {
        return {}; // Return an empty object if front matter is not found
    }
}

function updateHTML() {
    try {
        const markdownContent = fs.readFileSync(markdownFilePath, 'utf-8');
        const templateContent = fs.readFileSync(templateFilePath, 'utf-8');

        const metadata = extractMetadata(markdownContent);
        const contentStartIndex = markdownContent.indexOf('---', 3) + 3;
        const content = markdownContent.substring(contentStartIndex).trim();

        const htmlContent = converter.makeHtml(content);

        let finalHTML = templateContent;
        finalHTML = finalHTML.replace(
            '<title>[Your blog name]s\' blog posts</title>',
            `<title>${metadata.title || "[Your blog name]s' blog posts"}</title>`
        );
        finalHTML = finalHTML.replace(
            'content="[Your blog name]s\' blog posts"',
            `content="${metadata.title || "[Your blog name]s' blog posts"}"`
        );
        finalHTML = finalHTML.replace(
            'content="Click to read the blog now. No more newsletters—join the Telegram channel or follow the RSS feed for updates."',
            `content="${metadata.description || 'Click to read the blog now...'
            }"`
        );
        finalHTML = finalHTML.replace(
            'content="assets/default-social-image.png"',
            `content="${metadata.social_image || 'assets/default-social-image.png'}"`
        );
        finalHTML = finalHTML.replace(
            'content="Your Name"',
            `content="${metadata.author || 'Unknown Author'}"`
        );
        finalHTML = finalHTML.replace(
            '<p id="post-category"></p>',
            `<p id="post-category">${metadata.category || 'Uncategorized'}</p>`
        );
        finalHTML = finalHTML.replace(
            '<h3 id="post-title"></h3>',
            `<h3 id="post-title">${metadata.title || 'Untitled Post'}</h3>`
        );
        finalHTML = finalHTML.replace(
            '<p id="post-description"></p>',
            `<p id="post-description">${metadata.description || ''}</p>`
        );

        finalHTML = finalHTML.replace(
            '</body>',
            `<script>hljs.highlightAll();</script></body>`
        );

        let dateString = `Published by ${metadata.author || 'Unknown Author'
            } on ${formatDateTime(metadata.published)}`;
        if (metadata.updated) {
            const publishedDateTime = new Date(metadata.published).getTime();
            const updatedDateTime = new Date(metadata.updated).getTime();

            if (updatedDateTime >= publishedDateTime) {
                dateString += ` (Updated on ${formatDateTime(metadata.updated)})`;
            } else {
                console.error(
                    `Error in ${path.basename(
                        markdownFilePath
                    )}: Updated date/time cannot be earlier than published date/time.`
                );
                dateString += ' (Error in fetching Updated date)';
            }
        }
        finalHTML = finalHTML.replace(
            '<p id="post-author-date"></p>',
            `<p id="post-author-date">${dateString}</p>`
        );

        // Update paths in the template:
        finalHTML = finalHTML.replace('styles/post.css', 'styles/post.css');
        finalHTML = finalHTML.replace('js/copyLink.js', 'js/copyLink.js');
        finalHTML = finalHTML.replace('assets/favicon.svg', 'assets/favicon.svg');
        finalHTML = finalHTML.replaceAll('../assets', 'assets'); // Fix for social icons

        const contentWithCorrectImagePaths = htmlContent.replace(
            /src="(media\/[^"]+)"/g,
            (match, imagePath) => `src="posts/${imagePath}"`
        );

        finalHTML = finalHTML.replace(
            '<article id="post-content"></article>',
            `<article id="post-content">${contentWithCorrectImagePaths}</article>`
        );

        fs.promises.writeFile(outputFilePath, finalHTML)
            .then(() => {
                console.log(`Updated ${outputFilePath}`);
            })
            .catch(error => {
                console.error('Error writing HTML file:', error);
                if (error.code === 'ENOENT') {
                    console.error('Possible cause: Template file not found.');
                } else if (error.code === 'EACCES') {
                    console.error('Possible cause: Permission denied to write to the output file.');
                } else {
                    console.error('Possible cause:', error.message);
                }
            });

    } catch (error) {
        console.error(`Error updating HTML:`, error.message);
        if (error.code === 'ENOENT') {
            console.error(`Possible cause: Markdown file or template file not found.`);
        } else {
            console.error('Possible cause:', error.message);
        }
    }
}

function startLivePreview() {
    const watcher = chokidar.watch(markdownFilePath, {
        usePolling: true,
        interval: 500,
    }).on('all', (event, path) => {
        console.log(`File ${path} has been changed (${event})`);
        updateHTML();
    });

    process.on('SIGINT', () => {
        console.log('Stopping live preview...');
        if (fs.existsSync(outputFilePath)) {
            fs.unlinkSync(outputFilePath);
            console.log(`Deleted ${outputFilePath}`);
        }
        watcher.close();
        process.exit();
    });

    console.log(`Watching ${markdownFilePath} for changes...`);
    console.log(`Preview available at: file://${path.resolve(outputFilePath)}`);
}


function askForMarkdownFilePath() {
    readline.question('Enter the path to your Markdown file: ', (filePath) => {
        markdownFilePath = filePath.trim();

        if (fs.existsSync(markdownFilePath)) {
            console.log(`Markdown file found: ${markdownFilePath}`);
            startLivePreview();
        } else {
            console.error(`Markdown file not found: ${markdownFilePath}`);
            readline.close();
        }
    });
}

askForMarkdownFilePath();