const elements = {
  editor: document.getElementById("editor"),
  count: document.getElementById("count"),
  countNewlines: document.getElementById("count-newlines"),
  countSpaces: document.getElementById("count-spaces"),
  countEnglishWords: document.getElementById("count-english-words")
};

let editor;
const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");

function updateCount() {
  const value = getFilteredText();

  elements.count.value = elements.countEnglishWords.checked
    ? countWithEnglishWords(value)
    : Array.from(value).length;
}

function getFilteredText() {
  let value = normalizeLineEndings(editor ? editor.getValue() : "");

  if (!elements.countNewlines.checked) {
    value = value.replace(/[\r\n]/g, "");
  }

  if (!elements.countSpaces.checked) {
    value = value.replace(/[ \t　]/g, "");
  }

  return value;
}

function normalizeLineEndings(value) {
  return value.replace(/\r\n?/g, "\n");
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
    monaco.editor.defineTheme("counter-light", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#ffffff",
        "editor.foreground": "#1d1d1f",
        "editor.lineHighlightBackground": "#f5f5f7",
        "editorCursor.foreground": "#0071e3",
        "editorLineNumber.foreground": "#86868b",
        "editor.selectionBackground": "#0071e333",
        "scrollbarSlider.background": "#00000022",
        "scrollbarSlider.hoverBackground": "#00000033"
      }
    });

    monaco.editor.defineTheme("counter-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1c1c1e",
        "editor.foreground": "#f5f5f7",
        "editor.lineHighlightBackground": "#2c2c2e",
        "editorCursor.foreground": "#0a84ff",
        "editorLineNumber.foreground": "#8e8e93",
        "editor.selectionBackground": "#0a84ff44",
        "scrollbarSlider.background": "#ffffff24",
        "scrollbarSlider.hoverBackground": "#ffffff36"
      }
    });

    editor = monaco.editor.create(elements.editor, {
      automaticLayout: true,
      fontFamily: "Inter, Noto Sans JP, sans-serif",
      fontSize: 16,
      language: "plaintext",
      lineHeight: 24,
      minimap: { enabled: false },
      padding: { top: 24, bottom: 120 },
      renderLineHighlight: "line",
      scrollbar: {
        alwaysConsumeMouseWheel: false,
        useShadows: false,
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10
      },
      theme: getEditorTheme(),
      value: "",
      wordWrap: "on"
    });

    editor.onDidChangeModelContent(updateCount);
    colorScheme.addEventListener("change", () => {
      monaco.editor.setTheme(getEditorTheme());
    });
    editor.focus();
    updateCount();
  });
}

function getEditorTheme() {
  return colorScheme.matches ? "counter-dark" : "counter-light";
}

elements.countNewlines.addEventListener("change", updateCount);
elements.countSpaces.addEventListener("change", updateCount);
elements.countEnglishWords.addEventListener("change", updateCount);

initializeEditor();
