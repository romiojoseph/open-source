document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');
  const clearBtn = document.getElementById('clearBtn');
  const tabItems = document.querySelectorAll('.tab-item');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const outputText = document.getElementById('outputText');
  const description = document.getElementById('description');
  const copyBtn = document.getElementById('copyBtn');

  const descriptions = {
    original: "The original text as entered. This is useful for comparing how transformations alter the initial input.",
    
    uppercase: "Converts all letters to uppercase. This format is often used for emphasis in headings, titles, or alerts.",
    
    lowercase: "Converts all letters to lowercase. This style is commonly used in email addresses and URLs for consistency.",
    
    titlecase: "Ideal for titles and headings in articles or books, it excludes words like: a, an, the, and, but, or, nor, for, so, yet, in, on, at, by, with, from, under, above, over, through, during, including, he, she, it, they, them, their, its, is, am, are, was, were, be, been, being, as, to, into, onto, of, who, whom, whose, which, after, before, until, since, between, among, throughout, within, without.",
    
    absoluteTitleCase: "Capitalizes the first letter of every word. Useful for formal titles and names where every word is significant.",
    
    sentencecase: "Capitalizes the first letter of the first word in each sentence. Great for writing paragraphs or body text where clarity is essential.",
    
    camelcase: "Converts text to camel case (e.g., 'camelCase'). Commonly used in programming for variable names and function identifiers, making them easy to read.",
    
    pascalcase: "Converts text to Pascal case (e.g., 'PascalCase'). Frequently utilized in programming languages for class names and types, enhancing readability.",
    
    snakecase: "Converts text to snake case (e.g., 'snake_case'). Often used in database naming conventions and programming languages, making it easy to read and type.",
    
    kebabcase: "Converts text to kebab case (e.g., 'kebab-case'). Commonly used in URLs and CSS class names, providing a clean and readable format."
  };

  // Function to perform transformation and update output
  function performTransformation(targetPaneId) {
      const text = inputText.value;
      let transformedText = '';

      switch (targetPaneId) {
          case 'original':
              transformedText = text;
              break;
          case 'uppercase':
              transformedText = toUppercase(text);
              break;
          case 'lowercase':
              transformedText = toLowercase(text);
              break;
          case 'titlecase':
              transformedText = toTitleCase(text);
              break;
          case 'absoluteTitleCase':
              transformedText = toAbsoluteTitleCase(text);
              break;
          case 'sentencecase':
              transformedText = toSentenceCase(text);
              break;
          case 'camelcase':
              transformedText = toCamelCase(text);
              break;
          case 'pascalcase':
              transformedText = toPascalCase(text);
              break;
          case 'snakecase':
              transformedText = toSnakeCase(text);
              break;
          case 'kebabcase':
              transformedText = toKebabCase(text);
              break;
          default:
              transformedText = 'Select a transformation';
      }

      outputText.textContent = transformedText;
      description.textContent = descriptions[targetPaneId];

      // Show output since both conditions are the same
      output.style.display = 'flex';
  }

  // Event listeners for tabs
  tabItems.forEach(item => {
      item.addEventListener('click', () => {
          tabItems.forEach(tab => tab.classList.remove('active'));
          tabPanes.forEach(pane => pane.classList.remove('active'));

          item.classList.add('active');
          const targetPaneId = item.dataset.tab;
          document.getElementById(targetPaneId).classList.add('active');

          performTransformation(targetPaneId);
      });
  });

    // Event listener for clear button
    clearBtn.addEventListener('click', () => {
        inputText.value = '';
        outputText.textContent = '';
        output.style.display = 'none';

        // **FIX:** Reset description to "Original"
        description.textContent = descriptions['original']; 

        // Reset tabs to "Original"
        tabItems.forEach(tab => tab.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        tabItems[0].classList.add('active'); // Set "Original" as active
        document.getElementById('original').classList.add('active'); // Show "Original" content
    });

  // Event listener for copy button
  copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(outputText.textContent)
          .then(() => {
              alert("Text copied to clipboard!");
          })
          .catch(err => {
              console.error('Failed to copy: ', err);
          });
  });

  // Initial setup: hide output and set description for "Original" tab
  output.style.display = 'none';
  description.textContent = descriptions['original'];
});
