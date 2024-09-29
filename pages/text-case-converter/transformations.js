function toUppercase(text) {
    return text.toUpperCase();
  }
  
  function toLowercase(text) {
    return text.toLowerCase();
  }
  
  function toTitleCase(text) {
    const exceptions = ['a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'so', 'yet', 'in', 'on', 'at', 'by', 'with', 'from', 'under', 'above', 'over', 'through', 'during', 'including', 'he', 'she', 'it', 'they', 'them', 'their', 'its', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'as', 'to', 'into', 'onto', 'of', 'have', 'has', 'had', 'not', 'my', 'your', 'his', 'her', 'our', 'out', 'up', 'down', 'off', 'than', 'then', 'that', 'this', 'these', 'those', 'some', 'any', 'all', 'both', 'each', 'few', 'more', 'most', 'other', 'such', 'no', 'yes', 'who', 'whom', 'whose', 'which', 'after', 'before', 'until', 'since', 'between', 'among', 'throughout', 'within', 'without'];
    const words = text.split(' ');
    const titleCaseWords = words.map((word, index) => {
      if (index === 0 || !exceptions.includes(word.toLowerCase())) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    });
    return titleCaseWords.join(' ');
  }
  
  function toAbsoluteTitleCase(text) {
    return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }
  
  function toSentenceCase(text) {
    const sentences = text.split(/([.!?])/);
    const formattedSentences = sentences.map((sentence, index) => {
      if (index % 2 === 0) {
        return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
      }
      return sentence;
    });
    return formattedSentences.join('');
  }
  
  function toCamelCase(text) {
    const words = text.match(/\b\w+\b/g);
    if (!words) return text; // Return the original text if no words are found
    return words[0].toLowerCase() + words.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
  }
  
  function toPascalCase(text) {
    const words = text.match(/\b\w+\b/g);
    if (!words) return text; // Return the original text if no words are found
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
  }
  
  function toSnakeCase(text) {
    return text.replace(/\W+/g, '_').toLowerCase();
  }
  
  function toKebabCase(text) {
    return text.replace(/\W+/g, '-').toLowerCase();
  }