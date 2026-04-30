const elements = {
  editor: document.getElementById("editor"),
  count: document.getElementById("count"),
  countNewlines: document.getElementById("count-newlines"),
  countSpaces: document.getElementById("count-spaces"),
  countEnglishWords: document.getElementById("count-english-words")
};

let editor;

function updateCount() {
  const value = getFilteredText();

  elements.count.value = elements.countEnglishWords.checked
    ? countWithEnglishWords(value)
    : Array.from(value).length;
}

function getFilteredText() {
  let value = editor ? editor.getValue() : "";

  if (!elements.countNewlines.checked) {
    value = value.replace(/[\r\n]/g, "");
  }

  if (!elements.countSpaces.checked) {
    value = value.replace(/[ \t　]/g, "");
  }

  return value;
}

function countWithEnglishWords(value) {
  let total = 0;
  const englishWords = /[A-Za-z]+(?:['-][A-Za-z]+)*/g;
  let index = 0;
  let match;

  while ((match = englishWords.exec(value)) !== null) {
    total += countNonEnglish(value.slice(index, match.index));
    total += 1;
    index = match.index + match[0].length;
  }

  return total + countNonEnglish(value.slice(index));
}

function countNonEnglish(value) {
  return Array.from(value.replace(/\s/g, "")).length;
}

function initializeEditor() {
  require.config({
    paths: {
      vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs"
    }
  });

  require(["vs/editor/editor.main"], () => {
    editor = monaco.editor.create(elements.editor, {
      automaticLayout: true,
      language: "plaintext",
      minimap: { enabled: false },
      value: ""
    });

    editor.onDidChangeModelContent(updateCount);
    editor.focus();
    updateCount();
  });
}

elements.countNewlines.addEventListener("change", updateCount);
elements.countSpaces.addEventListener("change", updateCount);
elements.countEnglishWords.addEventListener("change", updateCount);

initializeEditor();
