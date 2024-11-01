_Created using LLMs. Google AI Studio for the majority of the code, Meta AI and ChatGPT for a few bug fixes, and Perplexity for the dummy text._

## Blogspot: Static Site Generator

This template uses Showdown, a JavaScript Markdown to HTML converter.

Read this link before copying the template:
https://romiojoseph.github.io/blogspot/blog/blogspot-template-doc.html

If you are all set,

### Download template

To download the `blogspot` folder, you can either:

1. Go to [Downgit](https://downgit.github.io/#/home) and paste the template source URL there.

**Or**

2. **Open a Terminal** in the directory where you want to download the folder and use the Git commands below.

*You can create a directory and navigate to it using `mkdir` and `cd` commands.*

**Clone the repository** (without checking out files):
```
git clone --no-checkout https://github.com/romiojoseph/open-source.git
```

**Navigate to the repository directory**:
```
cd open-source
```

**Enable sparse checkout**:
```
git sparse-checkout init --cone
```

**Set the folder to download**:
```
git sparse-checkout set templates/blogspot
```

**Checkout the main branch**:
```
git checkout main
```

### Begin
Now in the root directory of your project folder, run this command.

```bash
npm install showdown js-yaml chokidar xml2js
```


Write your posts.... and then run the below commands.

```bash
node build js
```

```bash
node sync js
```


To know more about supported styles:
https://romiojoseph.github.io/blogspot/blog/supported-styles.html

---

*P.S. Do not forget to change the repository name in the `404.html` file (script in the head tag).*
