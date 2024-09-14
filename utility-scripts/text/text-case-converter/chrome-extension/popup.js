document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');
  const output = document.getElementById('output');
  const transformBtn = document.getElementById('transformBtn');
  const clearBtn = document.getElementById('clearBtn'); // Reference to the Clear button

  // Check if the required elements exist
  if (inputText && output && transformBtn && clearBtn) {
      const lastConvertedText = localStorage.getItem('lastConvertedText');
      const lastOutputText = localStorage.getItem('lastOutputText');

      // Check if the last stored date is today
      const lastStoredDate = localStorage.getItem('lastStoredDate');
      const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

      if (lastStoredDate !== today) {
          localStorage.removeItem('lastConvertedText'); // Clear the text if it's a new day
          localStorage.removeItem('lastOutputText'); // Clear the output if it's a new day
          localStorage.setItem('lastStoredDate', today); // Update the stored date
      } else {
          if (lastConvertedText) {
              inputText.value = lastConvertedText; // Load last converted text
          }
          if (lastOutputText) {
              output.innerHTML = lastOutputText; // Load last output text
              output.style.display = 'block'; // Show output area
          }
      }

      transformBtn.addEventListener('click', () => {
          const text = inputText.value;

          const transformations = {
              'Uppercase': toUppercase(text),
              'Lowercase': toLowercase(text),
              'Title Case': toTitleCase(text),
              'Absolute Title Case': toAbsoluteTitleCase(text),
              'Sentence Case': toSentenceCase(text),
              'Camel Case': toCamelCase(text),
              'Pascal Case': toPascalCase(text),
              'Snake Case': toSnakeCase(text),
              'Kebab Case': toKebabCase(text)
          };

          output.innerHTML = ''; // Clear previous output
          for (const [key, value] of Object.entries(transformations)) {
              const p = document.createElement('p');
              const caption = document.createElement('span');
              caption.textContent = `${key}: `;
              caption.classList.add('caption'); // Add a class to the caption
              p.appendChild(caption);
              p.appendChild(document.createTextNode(value));
              output.appendChild(p);
          }

          // Show the output area after the first click
          output.style.display = 'block';

          // Adjust output height based on content
          output.style.height = 'auto'; // Reset height
          output.style.height = output.scrollHeight + 'px'; // Set to scroll height

          // Store the last converted text and output in localStorage
          localStorage.setItem('lastConvertedText', text);
          localStorage.setItem('lastOutputText', output.innerHTML); // Store the output
      });

      // Clear button functionality
      clearBtn.addEventListener('click', () => {
          inputText.value = ''; // Clear the input text
          output.innerHTML = ''; // Clear the output
          output.style.display = 'none'; // Hide output area
          localStorage.removeItem('lastConvertedText'); // Clear stored input
          localStorage.removeItem('lastOutputText'); // Clear stored output
      });
  } else {
      console.error('Required elements not found in the DOM.');
  }
});