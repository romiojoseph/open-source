import re
import msvcrt

def to_uppercase(text):
    return text.upper()

def to_lowercase(text):
    return text.lower()

def to_title_case(text):
    exceptions = {'a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'so', 'yet', 'in', 'on', 'at', 'by', 'with', 'from', 'under', 'above', 'over', 'through', 'during', 'including', 'he', 'she', 'it', 'they', 'them', 'their', 'its', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'as', 'at', 'to', 'into', 'onto', 'of', 'up', 'down', 'out', 'on', 'off', 'via'}
    words = text.split()
    title_case_words = [word.capitalize() if i == 0 or word.lower() not in exceptions else word.lower() for i, word in enumerate(words)]
    return ' '.join(title_case_words)

def to_absolute_title_case(text):
    return text.title()

def to_sentence_case(text):
    sentences = re.split(r'([.!?])', text)
    sentences = [sent.strip() for sent in sentences if sent.strip()]
    for i in range(0, len(sentences), 2):
        if sentences[i]:
            sentences[i] = sentences[i][0].upper() + sentences[i][1:].lower()
    return ''.join(sentences)

def to_camel_case(text):
    words = re.findall(r'\b\w+\b', text)
    if not words:
        return text
    return words[0].lower() + ''.join(word.capitalize() for word in words[1:])

def to_pascal_case(text):
    words = re.findall(r'\b\w+\b', text)
    return ''.join(word.capitalize() for word in words)

def to_snake_case(text):
    return re.sub(r'\W+', '_', text).strip('_').lower()

def to_kebab_case(text):
    return re.sub(r'\W+', '-', text).strip('-').lower()

def main():
    while True:
        text = input("Enter your text: ").strip()
        if not text:
            continue

        print("\nOriginal text:", text)
        print("\n1. Uppercase:")
        print(to_uppercase(text))
        print("\n2. Lowercase:")
        print(to_lowercase(text))
        print("\n3. Title Case:")
        print(to_title_case(text))
        print("\n4. Absolute Title Case:")
        print(to_absolute_title_case(text))
        print("\n5. Sentence Case:")
        print(to_sentence_case(text))
        print("\n6. Camel Case:")
        print(to_camel_case(text))
        print("\n7. Pascal Case:")
        print(to_pascal_case(text))
        print("\n8. Snake Case:")
        print(to_snake_case(text))
        print("\n9. Kebab Case:")
        print(to_kebab_case(text))

        print("\nPress any key to convert another text or close the window to exit.")
        msvcrt.getch()

if __name__ == "__main__":
    main()