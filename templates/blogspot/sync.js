const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');
const xml2js = require('xml2js');

const postsJsonPath = './assets/posts.json';
const rssFeedPath = './feed.xml';
const blogDir = './blog';

// Files and folders to hash check
const filesToCheck = ['index.html', '404.html', 'feed.xml', 'terms-and-policies.html', 'robots.txt'];
const foldersToCheck = ['blog', 'assets', 'js', 'styles'];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function crossCheckFiles() {
    try {
        const postsData = JSON.parse(fs.readFileSync(postsJsonPath, 'utf-8'));
        const xmlData = await xml2js.parseStringPromise(fs.readFileSync(rssFeedPath, 'utf-8'));
        const htmlFiles = fs.readdirSync(blogDir).filter(file => path.extname(file) === '.html');

        const jsonPostCount = postsData.length;
        const xmlPostCount = xmlData.rss.channel[0].item.length;
        const htmlFileCount = htmlFiles.length;

        // Check 1: Post Counts
        console.log(`Checking post counts...`);
        if (jsonPostCount !== xmlPostCount || jsonPostCount !== htmlFileCount) {
            console.error(`Error: Post counts do not match!`);
            console.log(`- JSON Post Count: ${jsonPostCount}`);
            console.log(`- XML Post Count: ${xmlPostCount}`);
            console.log(`- HTML File Count: ${htmlFileCount}`);
            return;
        } else {
            console.log(`- JSON, XML, and HTML post counts match: ${jsonPostCount}`);
        }

        // Check 2: XML Item Titles vs. JSON Titles 
        console.log(`\nChecking XML item titles against JSON titles...`);
        for (let i = 0; i < jsonPostCount; i++) {
            const jsonPost = postsData[i];
            const xmlPost = xmlData.rss.channel[0].item[i];

            if (jsonPost.title !== xmlPost.title[0]) {
                console.error(`- Error: Title mismatch for post ${i + 1}`);
                console.log(`  - JSON Title: ${jsonPost.title}`);
                console.log(`  - XML Title: ${xmlPost.title[0]}`);
            } else {
                console.log(`- Post ${i + 1} title match: "${jsonPost.title}"`);
            }
        }

        // Check 3: HTML File Names vs. JSON "file" Property
        console.log(`\nChecking HTML file names against JSON "file" property...`);
        for (let i = 0; i < jsonPostCount; i++) {
            const jsonPost = postsData[i];
            const expectedHtmlFileName = path.basename(jsonPost.file);

            if (!htmlFiles.includes(expectedHtmlFileName)) {
                console.error(`- Error: HTML file not found for post ${i + 1}`);
                console.log(`  - Expected HTML File Name: ${expectedHtmlFileName}`);
            } else {
                console.log(`- Post ${i + 1} HTML file found: "${expectedHtmlFileName}"`);
            }
        }

        console.log('\nCross-check completed successfully!');

        rl.question('\nSelect an option:\n1) Exit\n2) Begin crosschecking with production folder\n', (choice) => {
            if (choice === '1') {
                rl.close();
            } else if (choice === '2') {
                rl.question('Enter the path to the production folder: ', (productionPath) => {
                    productionPath = productionPath.trim();
                    crossCheckWithProduction(productionPath);
                });
            } else {
                console.log('Invalid choice. Exiting...');
                rl.close();
            }
        });

    } catch (error) {
        console.error('Error during cross-check:', error);
    }
}

function calculateFileHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}

function calculateFolderHash(folderPath) {
    const files = fs.readdirSync(folderPath);
    let hashSum = crypto.createHash('sha256');

    files.sort(); // Sort files for consistent hashing

    files.forEach(file => {
        const filePath = path.join(folderPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile()) {
            hashSum.update(calculateFileHash(filePath));
        } else if (stat.isDirectory()) {
            hashSum.update(calculateFolderHash(filePath));
        }
    });

    return hashSum.digest('hex');
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

function crossCheckWithProduction(productionPath) {
    const updatedFiles = [];
    const newFiles = [];

    filesToCheck.forEach(file => {
        const stagingFilePath = path.join(__dirname, file);
        const productionFilePath = path.join(productionPath, file);

        if (!fs.existsSync(productionFilePath)) {
            newFiles.push(stagingFilePath);
        } else {
            const stagingHash = calculateFileHash(stagingFilePath);
            const productionHash = calculateFileHash(productionFilePath);

            if (stagingHash !== productionHash) {
                updatedFiles.push(stagingFilePath);
            }
        }
    });

    foldersToCheck.forEach(folder => {
        const stagingFolderPath = path.join(__dirname, folder);
        const productionFolderPath = path.join(productionPath, folder);

        if (!fs.existsSync(productionFolderPath)) {
            newFiles.push(stagingFolderPath);
        } else {
            const stagingHash = calculateFolderHash(stagingFolderPath);
            const productionHash = calculateFolderHash(productionFolderPath);

            if (stagingHash !== productionHash) {
                updatedFiles.push(stagingFolderPath);
            }
        }
    });

    if (newFiles.length > 0 || updatedFiles.length > 0) {
        console.log('\nThe following files/folders are new or updated in staging:');
        newFiles.forEach(file => console.log(`- (New) ${file}`));
        updatedFiles.forEach(file => console.log(`- (Updated) ${file}`));

        rl.question('\nDo you want to copy these files/folders to production? (y/n): ', (answer) => {
            if (answer.toLowerCase() === 'y') {
                // Copy and replace logic 
                newFiles.forEach(file => {
                    const relativePath = path.relative(__dirname, file);
                    const productionTarget = path.join(productionPath, relativePath);

                    if (fs.lstatSync(file).isDirectory()) {
                        copyFolderRecursiveSync(file, productionTarget);
                    } else {
                        fs.copyFileSync(file, productionTarget);
                    }
                });

                updatedFiles.forEach(file => {
                    const relativePath = path.relative(__dirname, file);
                    const productionTarget = path.join(productionPath, relativePath);

                    if (fs.lstatSync(file).isDirectory()) {
                        copyFolderRecursiveSync(file, productionTarget);
                    } else {
                        fs.copyFileSync(file, productionTarget);
                    }
                });

                console.log('Files/folders copied to production!');
                rl.close();
            } else {
                console.log('Operation cancelled.');
                rl.close();
            }
        });
    } else {
        console.log('\nNo new or updated files/folders found in staging.');
        rl.close();
    }
}

crossCheckFiles();