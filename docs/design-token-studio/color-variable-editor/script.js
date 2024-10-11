// script.js

const colorCategories = document.getElementById('color-categories');
const copyCssButton = document.getElementById('copy-css-variables');
const contrastChecker = document.getElementById('contrast-checker');

const categories = [
  'primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info', 'neutral'
];

const shadeDropdowns = ['base', 'light', 'accent', 'dark'];

function populateColorGroupDropdown(category, colorGroupDropdown) {
  const colorGroups = Object.keys(colors[category === 'neutral' ? 'neutral' : 'theme']);

  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.text = 'Select a color group';
  colorGroupDropdown.appendChild(emptyOption);

  colorGroups.forEach(colorGroup => {
    const option = document.createElement('option');
    option.value = colorGroup;
    option.text = colorGroup;
    colorGroupDropdown.appendChild(option);
  });
}

function populateShadeDropdowns(category, colorGroup, shadeDropdowns) {
  shadeDropdowns.forEach(shade => {
    const shadeDropdown = document.getElementById(`${category}-${shade}`);
    shadeDropdown.innerHTML = '';

    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.text = `Select ${shade}`;
    shadeDropdown.appendChild(emptyOption);

    const shades = Object.keys(colors[category === 'neutral' ? 'neutral' : 'theme'][colorGroup]);
    shades.forEach(shadeName => {
      const option = document.createElement('option');
      option.value = shadeName;
      option.text = shadeName;
      shadeDropdown.appendChild(option);
    });
  });
}

function displayColors(category, colorGroup) {
  const colorDisplay = document.getElementById(`${category}-color-display`);
  colorDisplay.innerHTML = '';

  const shades = colors[category === 'neutral' ? 'neutral' : 'theme'][colorGroup];

  for (const shadeName in shades) {
    const hexCode = shades[shadeName];
    const colorBoxContainer = document.createElement('div');
    colorBoxContainer.classList.add('color-box-container');

    const colorBox = document.createElement('div');
    colorBox.classList.add('color-box');
    colorBox.style.backgroundColor = hexCode;
    colorBoxContainer.appendChild(colorBox);

    // Add class name to color info div
    const colorInfo = document.createElement('div'); 
    colorInfo.classList.add('color-info'); // Add the class here
    colorInfo.innerHTML = `
      <p>${shadeName}</p>
      <p>${hexCode}</p>
    `;
    colorBoxContainer.appendChild(colorInfo);

    colorDisplay.appendChild(colorBoxContainer);
  }
}

function generateCssVariables() {
  let cssVariables = ':root {\n';

  categories.forEach(category => {
      const colorGroup = document.getElementById(`${category}-color-group`).value;

      if (colorGroup) {
        cssVariables += `\t/* ${category.charAt(0).toUpperCase() + category.slice(1)} Colors */\n`;

        if (category === 'neutral') {
          const shades = colors.neutral[colorGroup];
          for (const shadeName in shades) {
            cssVariables += `\t--${shadeName}: ${shades[shadeName]};\n`;
          }
        } else {
          shadeDropdowns.forEach(shade => {
            const shadeName = document.getElementById(`${category}-${shade}`).value;
            const hexCode = colors[category === 'neutral' ? 'neutral' : 'theme'][colorGroup][shadeName];
            if (hexCode) { 
              cssVariables += `\t--${category}-${shade}: ${hexCode};\n`;
            }
          });
        }
        cssVariables += '\n'; 
      }
  });

  cssVariables += '}';
  return cssVariables;
}

function copyToClipboard() {
  const cssVariables = generateCssVariables();
  navigator.clipboard.writeText(cssVariables)
    .then(() => {
      alert('CSS variables copied to clipboard!');
    })
    .catch(err => {
      console.error('Failed to copy to clipboard: ', err);
    });
}

categories.forEach(category => {
  const colorGroupDropdown = document.getElementById(`${category}-color-group`);
  if (colorGroupDropdown) {
    populateColorGroupDropdown(category, colorGroupDropdown);
    colorGroupDropdown.addEventListener('change', () => {
      const colorGroup = colorGroupDropdown.value;
      if (category !== 'neutral') {
        populateShadeDropdowns(category, colorGroup, shadeDropdowns);
      }
      displayColors(category, colorGroup);
      checkRequiredFields(); 
    });
  }
});

categories.filter(category => category !== 'neutral').forEach(category => {
  shadeDropdowns.forEach(shade => {
    const shadeDropdown = document.getElementById(`${category}-${shade}`);
    if (shadeDropdown) {
      shadeDropdown.addEventListener('change', checkRequiredFields);
    }
  });
});

categories.filter(category => category !== 'primary' && category !== 'neutral').forEach(category => {
  const toggleButton = document.getElementById(`toggle-${category}`);
  const categoryDiv = document.getElementById(category);

  toggleButton.addEventListener('click', () => {
    if (categoryDiv.classList.contains('hidden')) {
      categoryDiv.classList.remove('hidden');
      toggleButton.parentElement.querySelector('.slider').style.backgroundColor = '#2196F3';
    } else {
      categoryDiv.classList.add('hidden');
      toggleButton.parentElement.querySelector('.slider').style.backgroundColor = '#ccc';
    }
    checkRequiredFields(); 
  });
});

function checkRequiredFields() {
  let atLeastOneColorGroupSelected = false;

  categories.forEach(category => {
    const colorGroupDropdown = document.getElementById(`${category}-color-group`);
    if (colorGroupDropdown.value) {
      atLeastOneColorGroupSelected = true;
    }
  });

  copyCssButton.disabled = !atLeastOneColorGroupSelected;
}

copyCssButton.addEventListener('click', copyToClipboard);

function luminance(r, g, b) {
  var a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(rgb1, rgb2) {
  var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  var brightest = Math.max(lum1, lum2);
  var darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}

function checkContrastWCAG() {
  var foregroundColor = hexToRgb(document.getElementById("foreground").value);
  var backgroundColor = hexToRgb(document.getElementById("background").value);
  var contrastRatio = contrast(foregroundColor, backgroundColor);

  var resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  displayResultWCAG("AA Large", 3, contrastRatio);
  displayResultWCAG("AAA Large", 4.5, contrastRatio);
  displayResultWCAG("AA Normal", 4.5, contrastRatio);
  displayResultWCAG("AAA Normal", 7, contrastRatio);
}

function displayResultWCAG(level, requiredRatio, actualRatio) {
  var resultDiv = document.createElement("div");
  resultDiv.className = "result";
  resultDiv.innerHTML = level + ": " + actualRatio.toFixed(2) +
    " (Req: " + requiredRatio + ") - " +
    (actualRatio >= requiredRatio ? "Pass" : "Fail");
  resultDiv.classList.add(actualRatio >= requiredRatio ? "pass" : "fail");
  document.getElementById("results").appendChild(resultDiv);
}

function reverseColors() {
  var foregroundInput = document.getElementById("foreground");
  var backgroundInput = document.getElementById("background");
  var foregroundHex = document.getElementById("foregroundHex");
  var backgroundHex = document.getElementById("backgroundHex");

  var tempColor = foregroundInput.value;
  foregroundInput.value = backgroundInput.value;
  backgroundInput.value = tempColor;

  var tempHex = foregroundHex.value;
  foregroundHex.value = backgroundHex.value;
  backgroundHex.value = tempHex;

  checkContrastWCAG();
}

function updateHexFromColor(idPrefix) {
  var colorPicker = document.getElementById(idPrefix);
  var hexInput = document.getElementById(idPrefix + "Hex");
  hexInput.value = colorPicker.value.substring(1);
  checkContrastWCAG();
}

function updateColorFromHex(idPrefix) {
  var hexInput = document.getElementById(idPrefix + "Hex");
  var colorPicker = document.getElementById(idPrefix);

  if (/^[0-9a-f]{6}$/i.test(hexInput.value)) {
    colorPicker.value = "#" + hexInput.value;
    checkContrastWCAG();
  }
}

checkContrastWCAG();