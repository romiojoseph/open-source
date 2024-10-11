function populateBaseFontSizeDropdown() {
  const baseFontSizeSelect = document.getElementById('baseFontSize');
  for (let i = 8; i <= 64; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.text = i;
    if (i === 16) {
      option.selected = true;
    }
    baseFontSizeSelect.appendChild(option);
  }
}

function calculateFontSizes() {
  const baseFontSize = parseFloat(document.getElementById('baseFontSize').value);
  const scaleRatio = parseFloat(document.getElementById('scaleRatio').value);
  const useRem = document.getElementById('unitToggle').checked;
  const roundValues = document.getElementById('roundToggle').checked;
  const unit = useRem ? 'rem' : 'px';
  const baseFontSizeInRem = useRem ? baseFontSize / 16 : baseFontSize;
  const boldHeadings = document.getElementById('boldToggle').checked;

  const fontSizes = {
    'displayLarge': baseFontSizeInRem * Math.pow(scaleRatio, 10),
    'displayMedium': baseFontSizeInRem * Math.pow(scaleRatio, 9),
    'displaySmall': baseFontSizeInRem * Math.pow(scaleRatio, 8),
    'heading1': baseFontSizeInRem * Math.pow(scaleRatio, 7),
    'heading2': baseFontSizeInRem * Math.pow(scaleRatio, 6),
    'heading3': baseFontSizeInRem * Math.pow(scaleRatio, 5),
    'heading4': baseFontSizeInRem * Math.pow(scaleRatio, 4),
    'heading5': baseFontSizeInRem * Math.pow(scaleRatio, 3),
    'heading6': baseFontSizeInRem * Math.pow(scaleRatio, 2),
    'subtitle': baseFontSizeInRem * scaleRatio,
    'body': baseFontSizeInRem,
    'caption': baseFontSizeInRem / scaleRatio,
    'label': baseFontSizeInRem / Math.pow(scaleRatio, 2),
    'tagline': baseFontSizeInRem / Math.pow(scaleRatio, 3),
  };

  for (const element in fontSizes) {
    const fontSize = roundValues ? Math.round(fontSizes[element]) : fontSizes[element].toFixed(3);
    document.getElementById(element).textContent = `${fontSize}${unit}`;

    if (document.getElementById('previewToggle').checked) {
      document.getElementById(`${element}Text`).style.fontSize = `${fontSize}${unit}`;
    } else {
      document.getElementById(`${element}Text`).style.fontSize = '';
    }

    if (boldHeadings && ['displayLarge', 'displayMedium', 'displaySmall', 'heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6'].includes(element)) {
      document.getElementById(`${element}Text`).style.fontWeight = 'bold';
    } else {
      document.getElementById(`${element}Text`).style.fontWeight = '';
    }
  }

  document.getElementById('unitLabel').textContent = unit;
}

function changeTableFont() {
  const selectedFont = document.getElementById('fontFamily').value;
  const tableRows = document.querySelectorAll('#fontTable tbody tr');
  tableRows.forEach(row => {
    const firstCell = row.querySelector('td:first-child');
    firstCell.style.fontFamily = selectedFont;
  });
}

function updateCustomText() {
  const customText = document.getElementById('customText').value;
  const tableRows = document.querySelectorAll('#fontTable tbody tr');
  tableRows.forEach(row => {
    const firstCell = row.querySelector('td:first-child');
    firstCell.textContent = customText || firstCell.getAttribute('data-default');
  });

  if (customText) {
    document.getElementById('previewToggle').checked = true;
    calculateFontSizes(); // Ensure font sizes are recalculated with preview mode on
  }
}

function clearCustomText() {
  const customTextInput = document.getElementById('customText');
  customTextInput.value = '';
  updateCustomText();
  calculateFontSizes(); // Ensure font sizes are recalculated with preview mode off
}

function copyCSSVariables() {
  const fontSizes = {
    'displayLarge': document.getElementById('displayLarge').textContent,
    'displayMedium': document.getElementById('displayMedium').textContent,
    'displaySmall': document.getElementById('displaySmall').textContent,
    'heading1': document.getElementById('heading1').textContent,
    'heading2': document.getElementById('heading2').textContent,
    'heading3': document.getElementById('heading3').textContent,
    'heading4': document.getElementById('heading4').textContent,
    'heading5': document.getElementById('heading5').textContent,
    'heading6': document.getElementById('heading6').textContent,
    'subtitle': document.getElementById('subtitle').textContent,
    'body': document.getElementById('body').textContent,
    'caption': document.getElementById('caption').textContent,
    'label': document.getElementById('label').textContent,
    'tagline': document.getElementById('tagline').textContent,
  };

  let cssVariables = ':root {\n';
  for (const element in fontSizes) {
    cssVariables += `  --font-size-${element.replace(/ /g, '-')}: ${fontSizes[element]};\n`;
  }
  cssVariables += '}';

  navigator.clipboard.writeText(cssVariables).then(() => {
    alert('CSS variables copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy CSS variables: ', err);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  populateBaseFontSizeDropdown();
  calculateFontSizes();
});

document.getElementById('baseFontSize').addEventListener('change', calculateFontSizes);
document.getElementById('scaleRatio').addEventListener('change', calculateFontSizes);
document.getElementById('unitToggle').addEventListener('change', calculateFontSizes);
document.getElementById('roundToggle').addEventListener('change', calculateFontSizes);
document.getElementById('previewToggle').addEventListener('change', calculateFontSizes);
document.getElementById('boldToggle').addEventListener('change', calculateFontSizes);
document.getElementById('fontFamily').addEventListener('change', changeTableFont);
document.getElementById('customText').addEventListener('input', updateCustomText);
document.getElementById('clearText').addEventListener('click', clearCustomText);
document.getElementById('copyCSS').addEventListener('click', copyCSSVariables);
