const showdown = require('showdown');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const yaml = require('js-yaml'); // YAML parser

const postsDir = './posts';
const templatesDir = './templates';
const outputDir = './blog';
const postsJsonPath = './assets/posts.json';
const mediaDir = './posts/media';
const outputMediaDir = './blog/media';
const rssFeedPath = './feed.xml';
const buildLogPath = './build.log';

// Social Image Base URL (Add your GitHub Pages image URL here)
const SOCIAL_IMAGE_BASE_URL = "https://romiojoseph.github.io/blogspot/blog/media/images/";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    return `${date.getDate()} ${date.toLocaleString('default', {
        month: 'short'
    })} ${date.getFullYear()} • ${formattedHours}:${minutes < 10 ? '0' + minutes : minutes
        } ${ampm}`;
}

function formatDateForRSS(dateString) {
    const date = new Date(dateString);
    return date.toUTCString();
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

function getMarkdownFilesRecursive(directory) {
    let markdownFiles = [];
    let draftFiles = [];

    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            const { markdownFiles: subMarkdownFiles, draftFiles: subDraftFiles } = getMarkdownFilesRecursive(filePath);
            markdownFiles = markdownFiles.concat(subMarkdownFiles);
            draftFiles = draftFiles.concat(subDraftFiles);
        } else if (path.extname(file) === '.md') {
            if (file.startsWith('_')) {
                draftFiles.push(filePath);
            } else {
                markdownFiles.push(filePath);
            }
        }
    });

    return { markdownFiles, draftFiles };
}

function generateRSSFeed(posts, channelInfo) {
    const rssItems = posts.map(post => {
        const urlFilePath = post.file.replace(/\\/g, '/');

        return `
            <item>
                <title>${post.title}</title>
                <link>${path.posix.join(channelInfo.link, urlFilePath)}</link>
                <description>${post.description}</description>
                <pubDate>${formatDateForRSS(post.published)}</pubDate>
            </item>
        `;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
        <channel>
            <title>${channelInfo.title}</title>
            <link>${channelInfo.link}</link>
            <description>${channelInfo.description}</description>
            <language>${channelInfo.language}</language>
            <lastBuildDate>${channelInfo.lastBuildDate}</lastBuildDate>
            ${rssItems}
        </channel>
    </rss>`;
}

function createBuildLog(markdownFiles) {
    const logData = markdownFiles.map(file => ({
        filePath: file,
        created: fs.statSync(file).birthtimeMs,
        modified: fs.statSync(file).mtimeMs
    }));
    fs.writeFileSync(buildLogPath, JSON.stringify(logData, null, 2));
}

function getUpdatedFiles(markdownFiles, buildLog) {
    const updatedFiles = [];
    const newFiles = [];
    const deletedFiles = [];

    for (const file of markdownFiles) {
        const logEntry = buildLog.find(entry => entry.filePath === file);
        if (logEntry) {
            const currentModified = fs.statSync(file).mtimeMs;
            if (currentModified > logEntry.modified) {
                updatedFiles.push(file);
            }
        } else {
            newFiles.push(file);
        }
    }

    for (const entry of buildLog) {
        if (!markdownFiles.includes(entry.filePath)) {
            deletedFiles.push(entry.filePath);
        }
    }

    return { updatedFiles, newFiles, deletedFiles };
}

function buildHTMLFiles(filesToBuild) {
    filesToBuild.forEach(markdownFilePath => {
        const outputFileName = path.basename(markdownFilePath, '.md').toLowerCase().replace(/\s+/g, '-') + '.html';
        const outputFilePath = path.join(outputDir, outputFileName);
        const templateFilePath = path.join(templatesDir, 'post.html');

        const markdownContent = fs.readFileSync(markdownFilePath, 'utf-8');
        const metadata = extractMetadata(markdownContent);

        convertMarkdownToHTML(
            markdownFilePath,
            templateFilePath,
            outputFilePath,
            metadata
        );
    });
}

function convertMarkdownToHTML(
    markdownFilePath,
    templateFilePath,
    outputFilePath,
    metadata
) {
    try {
        const markdownContent = fs.readFileSync(markdownFilePath, 'utf-8');
        const templateContent = fs.readFileSync(templateFilePath, 'utf-8');

        const contentStartIndex = markdownContent.indexOf('---', 3) + 3;
        const content = markdownContent.substring(contentStartIndex).trim();

        const converter = new showdown.Converter({
            tables: true,
            simplifiedAutoLink: true,
            strikethrough: true,
            tasklists: true,
        });

        const htmlContent = converter.makeHtml(content);

        const relativePathToRoot = path.relative(path.dirname(outputFilePath), '.');

        const faviconPath = path.join(relativePathToRoot, 'assets', 'favicon.svg');
        const postCssPath = path.join(relativePathToRoot, 'styles', 'post.css');
        const copyLinkJsPath = path.join(relativePathToRoot, 'js', 'copyLink.js');
        const mainJsPath = path.join(relativePathToRoot, 'js', 'script.js');
        const openExternalLinksJsPath = path.join(relativePathToRoot, 'js', 'openExternalLinks.js');

        const socialIconPath = path.join(relativePathToRoot, 'assets');

        let finalHTML = templateContent;

        finalHTML = finalHTML.replace('assets/favicon.svg', faviconPath);
        finalHTML = finalHTML.replace('styles/post.css', postCssPath);
        finalHTML = finalHTML.replace('js/copyLink.js', copyLinkJsPath);
        finalHTML = finalHTML.replace('js/script.js', mainJsPath);
        finalHTML = finalHTML.replace('js/openExternalLinks.js', openExternalLinksJsPath);
        finalHTML = finalHTML.replaceAll('SOCIAL_ICON_PATH', socialIconPath);

        finalHTML = finalHTML.replace(
            '<article id="post-content"></article>',
            `<article id="post-content">${htmlContent}</article>`
        );

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

        // Construct the full social image URL 
        const imageName = path.basename(metadata.social_image || 'default-social-image.png'); // Extract image file name
        const socialImageUrl = SOCIAL_IMAGE_BASE_URL + imageName;

        finalHTML = finalHTML.replace(
            'content="assets/default-social-image.png"',
            `content="${socialImageUrl}"`
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

        finalHTML = finalHTML.replace(
            '</body>',
            `<script>hljs.highlightAll();</script></body>`
        );

        fs.writeFileSync(outputFilePath, finalHTML);

        console.log(`Converted: ${outputFilePath}`);
    } catch (error) {
        console.error(`Error converting ${markdownFilePath}:`, error);
    }
}

function startBuild() {
    const { markdownFiles, draftFiles } = getMarkdownFilesRecursive(postsDir);
    const postsData = [];

    if (fs.existsSync(postsJsonPath)) {
        try {
            const existingPostsData = JSON.parse(fs.readFileSync(postsJsonPath, 'utf-8'));
            postsData.push(...existingPostsData);
        } catch (error) {
            console.error('Error loading existing posts.json:', error);
        }
    }

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    if (fs.existsSync(mediaDir)) {
        copyFolderRecursiveSync(mediaDir, outputMediaDir);
    }

    if (draftFiles.length > 0) {
        console.log('\nThe following Markdown files will not be converted to HTML because they are in draft status (filename starts with "_"):');
        draftFiles.forEach(file => console.log(`- ${file}`));
    }

    if (fs.existsSync(buildLogPath)) {
        const buildLog = JSON.parse(fs.readFileSync(buildLogPath, 'utf-8'));
        const { updatedFiles, newFiles, deletedFiles } = getUpdatedFiles(markdownFiles, buildLog);

        console.log('\nWelcome to Markdown to HTML build script\n');
        console.log('What do you need to do?\n');
        console.log('1) Find the updated and newly created files');
        console.log('2) Build all HTML\n');

        rl.question('Enter your choice (1 or 2): ', (choice) => {
            if (choice === '1') {
                console.log('\nUpdated files:');
                updatedFiles.forEach(file => console.log(`- ${file}`));
                console.log('\nNew files:');
                newFiles.forEach(file => console.log(`- ${file}`));
                console.log('\nDeleted files:');
                deletedFiles.forEach(file => console.log(`- ${file}`));

                console.log('\n1) Build only these files');
                console.log('2) Build all files\n');

                rl.question('Enter your choice (1 or 2): ', (buildChoice) => {
                    if (buildChoice === '1') {
                        buildHTMLFiles([...updatedFiles, ...newFiles]);
                    } else if (buildChoice === '2') {
                        buildHTMLFiles(markdownFiles);
                    } else {
                        console.log('Invalid choice. Exiting...');
                        rl.close();
                        return;
                    }

                    createBuildLog(markdownFiles);

                    markdownFiles.forEach(markdownFilePath => {
                        const outputFileName = path.basename(markdownFilePath, '.md').toLowerCase().replace(/\s+/g, '-') + '.html';
                        const outputFilePath = path.join(outputDir, outputFileName);
                        const templateFilePath = path.join(templatesDir, 'post.html');

                        const markdownContent = fs.readFileSync(markdownFilePath, 'utf-8');
                        const metadata = extractMetadata(markdownContent);

                        const socialImagePath = metadata.social_image || 'assets/default-social-image.png';

                        let existingPostData = postsData.find(post => post.file === outputFilePath);

                        if (existingPostData) {
                            existingPostData.title = metadata.title;
                            existingPostData.description = metadata.description;
                            existingPostData.social_image = socialImagePath;
                            existingPostData.author = metadata.author;
                            existingPostData.published = metadata.published;
                            existingPostData.updated = metadata.updated;
                            existingPostData.category = metadata.category;
                        } else {
                            postsData.push({
                                file: outputFilePath,
                                title: metadata.title,
                                description: metadata.description,
                                social_image: socialImagePath,
                                author: metadata.author,
                                published: metadata.published,
                                updated: metadata.updated,
                                category: metadata.category,
                                post_type: metadata.post_type || "regular"
                            });
                        }
                    });

                    postsData.sort((a, b) => new Date(b.published) - new Date(a.published));

                    const channelInfo = {
                        title: 'Blogspot',
                        link: 'https://romiojoseph.github.io/blogspot',
                        description: 'Blogspot is a custom Static Site Generator (SSG) built with Node.js and Showdown.js. It converts Markdown files from Obsidian into fast, scalable, and customizable static HTML websites. Perfect for bloggers, writers, and developers seeking simplicity and flexibility.',
                        language: 'en-us',
                        lastBuildDate: formatDateForRSS(postsData[0].published)
                    };

                    const rssFeed = generateRSSFeed(postsData, channelInfo);
                    fs.writeFileSync(rssFeedPath, rssFeed);

                    fs.writeFileSync(postsJsonPath, JSON.stringify(postsData, null, 4));

                    console.log(`\nMarkdown conversion complete! ${markdownFiles.length} HTML files generated.`);
                    console.log(`posts.json generated successfully! Contains ${postsData.length} posts.`);
                    console.log(`RSS feed generated successfully! Contains ${postsData.length} items.\n`);

                    rl.close();
                });
            } else if (choice === '2') {
                buildHTMLFiles(markdownFiles);
                createBuildLog(markdownFiles);

                markdownFiles.forEach(markdownFilePath => {
                    const outputFileName = path.basename(markdownFilePath, '.md').toLowerCase().replace(/\s+/g, '-') + '.html';
                    const outputFilePath = path.join(outputDir, outputFileName);
                    const templateFilePath = path.join(templatesDir, 'post.html');

                    const markdownContent = fs.readFileSync(markdownFilePath, 'utf-8');
                    const metadata = extractMetadata(markdownContent);

                    const socialImagePath = metadata.social_image || 'assets/default-social-image.png';

                    let existingPostData = postsData.find(post => post.file === outputFilePath);

                    if (existingPostData) {
                        existingPostData.title = metadata.title;
                        existingPostData.description = metadata.description;
                        existingPostData.social_image = socialImagePath;
                        existingPostData.author = metadata.author;
                        existingPostData.published = metadata.published;
                        existingPostData.updated = metadata.updated;
                        existingPostData.category = metadata.category;
                    } else {
                        postsData.push({
                            file: outputFilePath,
                            title: metadata.title,
                            description: metadata.description,
                            social_image: socialImagePath,
                            author: metadata.author,
                            published: metadata.published,
                            updated: metadata.updated,
                            category: metadata.category,
                            post_type: metadata.post_type || "regular"
                        });
                    }
                });

                postsData.sort((a, b) => new Date(b.published) - new Date(a.published));

                const channelInfo = {
                    title: 'Blogspot',
                    link: 'https://romiojoseph.github.io/blogspot',
                    description: 'Blogspot is a custom Static Site Generator (SSG) built with Node.js and Showdown.js. It converts Markdown files from Obsidian into fast, scalable, and customizable static HTML websites. Perfect for bloggers, writers, and developers seeking simplicity and flexibility.',
                    language: 'en-us',
                    lastBuildDate: formatDateForRSS(postsData[0].published)
                };

                const rssFeed = generateRSSFeed(postsData, channelInfo);
                fs.writeFileSync(rssFeedPath, rssFeed);

                fs.writeFileSync(postsJsonPath, JSON.stringify(postsData, null, 4));

                console.log(`\nMarkdown conversion complete! ${markdownFiles.length} HTML files generated.`);
                console.log(`posts.json generated successfully! Contains ${postsData.length} posts.`);
                console.log(`RSS feed generated successfully! Contains ${postsData.length} items.\n`);
                rl.close();
            } else {
                console.log('Invalid choice. Exiting...');
                rl.close();
            }
        });
    } else {
        console.log('\nNo previous build log found. Building all HTML files.\n');
        buildHTMLFiles(markdownFiles);
        createBuildLog(markdownFiles);

        markdownFiles.forEach(markdownFilePath => {
            const outputFileName = path.basename(markdownFilePath, '.md').toLowerCase().replace(/\s+/g, '-') + '.html';
            const outputFilePath = path.join(outputDir, outputFileName);
            const templateFilePath = path.join(templatesDir, 'post.html');

            const markdownContent = fs.readFileSync(markdownFilePath, 'utf-8');
            const metadata = extractMetadata(markdownContent);

            const socialImagePath = metadata.social_image || 'assets/default-social-image.png';

            let existingPostData = postsData.find(post => post.file === outputFilePath);

            if (existingPostData) {
                existingPostData.title = metadata.title;
                existingPostData.description = metadata.description;
                existingPostData.social_image = socialImagePath;
                existingPostData.author = metadata.author;
                existingPostData.published = metadata.published;
                existingPostData.updated = metadata.updated;
                existingPostData.category = metadata.category;
            } else {
                postsData.push({
                    file: outputFilePath,
                    title: metadata.title,
                    description: metadata.description,
                    social_image: socialImagePath,
                    author: metadata.author,
                    published: metadata.published,
                    updated: metadata.updated,
                    category: metadata.category,
                    post_type: metadata.post_type || "regular"
                });
            }
        });

        postsData.sort((a, b) => new Date(b.published) - new Date(a.published));

        const channelInfo = {
            title: 'Blogspot',
            link: 'https://romiojoseph.github.io/blogspot',
            description: 'Blogspot is a custom Static Site Generator (SSG) built with Node.js and Showdown.js. It converts Markdown files from Obsidian into fast, scalable, and customizable static HTML websites. Perfect for bloggers, writers, and developers seeking simplicity and flexibility.',
            language: 'en-us',
            lastBuildDate: formatDateForRSS(postsData[0].published)
        };

        const rssFeed = generateRSSFeed(postsData, channelInfo);
        fs.writeFileSync(rssFeedPath, rssFeed);

        fs.writeFileSync(postsJsonPath, JSON.stringify(postsData, null, 4));

        console.log(`\nMarkdown conversion complete! ${markdownFiles.length} HTML files generated.`);
        console.log(`posts.json generated successfully! Contains ${postsData.length} posts.`);
        console.log(`RSS feed generated successfully! Contains ${postsData.length} items.\n`);
        rl.close();
    }
}

function copyFolderRecursiveSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    const files = fs.readdirSync(source);
    files.forEach((file) => {
        const curSource = path.join(source, file);
        const curTarget = path.join(target, file);
        if (fs.lstatSync(curSource).isDirectory()) {
            copyFolderRecursiveSync(curSource, curTarget);
        } else {
            fs.copyFileSync(curSource, curTarget);
        }
    });
}

startBuild();