import { lessons } from "./lessons.js";

const progressKey = "java-trail-progress-v1";
const state = loadProgress();
const nav = document.querySelector("#lesson-nav");
const view = document.querySelector("#lesson-view");
const dialog = document.querySelector("#about-dialog");

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(progressKey) || "{}");
    return {
      completed: Array.isArray(saved.completed) ? saved.completed : [],
      active: lessons.some((lesson) => lesson.id === saved.active) ? saved.active : lessons[0].id,
    };
  } catch {
    return { completed: [], active: lessons[0].id };
  }
}

function saveProgress() {
  try {
    localStorage.setItem(progressKey, JSON.stringify(state));
  } catch {
    // The current session still works when browser storage is unavailable.
  }
}

function renderProgress() {
  const percent = Math.round((state.completed.length / lessons.length) * 100);
  document.querySelector("#progress-text").textContent = `${percent}%`;
  document.querySelector("#progress-fill").style.width = `${percent}%`;
  nav.innerHTML = lessons.map((lesson, index) => {
    const complete = state.completed.includes(lesson.id);
    const active = state.active === lesson.id;
    return `<button class="lesson-nav-item ${active ? "active" : ""} ${complete ? "complete" : ""}" type="button" data-lesson="${lesson.id}" aria-current="${active ? "step" : "false"}">
      <span class="lesson-index">${complete ? "✓" : lesson.number}</span><span class="lesson-nav-copy"><strong>${lesson.label}</strong><small>${lesson.duration}</small></span><span class="lesson-nav-arrow">${active ? "↗" : ""}</span>
    </button>`;
  }).join("");
  nav.querySelectorAll("[data-lesson]").forEach((button) => {
    button.addEventListener("click", () => openLesson(button.dataset.lesson));
  });
}

function renderLesson() {
  const lesson = lessons.find((item) => item.id === state.active) || lessons[0];
  const index = lessons.findIndex((item) => item.id === lesson.id);
  const completed = state.completed.includes(lesson.id);
  view.setAttribute("aria-busy", "false");
  view.innerHTML = `
    <div class="lesson-topline"><span class="lesson-breadcrumb">JAVA BASICS <span>/</span> PART ${lesson.number}</span><span class="duration-pill">◷ &nbsp;${lesson.duration}</span></div>
    <div class="lesson-content"><p class="eyebrow lesson-tag"><span class="eyebrow-star">✳</span> ${lesson.tag}</p>
      <h2 class="lesson-title">${lesson.title}</h2><p class="lesson-intro">${lesson.intro}</p>
      <div class="code-card"><div class="code-top"><div class="window-dots"><i></i><i></i><i></i></div><span>JAVA EXAMPLE</span><button type="button" class="copy-code" aria-label="Copy Java example">▣ <span>Copy</span></button></div><pre><code>${escapeHtml(lesson.code)}</code></pre></div>
      <div class="insight-card"><span class="insight-mark">✳</span><p><b>Keep in mind</b><br />${lesson.insight}</p></div>
      ${lesson.id === "conversions" ? renderConverter() : ""}
      <section class="practice-card" aria-labelledby="practice-title"><div class="practice-heading"><span class="practice-icon">?</span><div><p class="eyebrow">QUICK PRACTICE</p><h3 id="practice-title">Check your understanding.</h3></div><span class="practice-count">01 QUESTION</span></div><p class="question-text">${lesson.question}</p><fieldset class="answer-list" aria-label="Choose your answer">${lesson.options.map((option, optionIndex) => `<label class="answer-option"><input type="radio" name="answer" value="${optionIndex}" /><span class="answer-letter">${String.fromCharCode(65 + optionIndex)}</span><span>${escapeHtml(option)}</span></label>`).join("")}</fieldset><div class="quiz-actions"><button class="check-answer" type="button">Check answer <span>↗</span></button><p class="quiz-feedback" role="status" aria-live="polite"></p></div></section>
      <div class="lesson-actions"><button class="prev-lesson" type="button" ${index === 0 ? "disabled" : ""}>← Previous</button><button class="complete-lesson ${completed ? "is-complete" : ""}" type="button">${completed ? "Completed ✓" : "Mark as complete"}</button><button class="next-lesson" type="button" ${index === lessons.length - 1 ? "disabled" : ""}>Next lesson <span>→</span></button></div>
    </div>`;
  view.querySelector(".check-answer").addEventListener("click", () => checkAnswer(lesson));
  view.querySelector(".copy-code").addEventListener("click", (event) => copyCode(lesson.code, event.currentTarget));
  view.querySelector(".complete-lesson").addEventListener("click", () => completeLesson(lesson, index));
  view.querySelector(".prev-lesson").addEventListener("click", () => openLesson(lessons[index - 1]?.id));
  view.querySelector(".next-lesson").addEventListener("click", () => openLesson(lessons[index + 1]?.id));
  if (lesson.id === "conversions") connectConverter();
}

function renderConverter() {
  return `<section class="converter-card" aria-labelledby="converter-title"><div class="converter-heading"><span class="converter-symbol">⇄</span><div><p class="eyebrow">TRY IT YOURSELF</p><h3 id="converter-title">Conversion sandbox</h3></div></div><p>Explore how a numeric cast changes a value. The result follows Java’s primitive numeric conversion rules.</p><div class="converter-form"><label>Value<input id="convert-value" type="number" step="any" value="130" /></label><label>From<select id="convert-from"><option>int</option><option>double</option><option>float</option><option>long</option></select></label><span class="convert-arrow" aria-hidden="true">→</span><label>To<select id="convert-to"><option>byte</option><option>short</option><option>int</option><option>long</option><option>float</option><option>double</option></select></label></div><div class="converter-result" aria-live="polite"><span>JAVA RESULT</span><output id="convert-result">(byte) 130 → -126</output></div><p class="converter-footnote">The sandbox covers numeric primitive conversions; it does not compile or execute arbitrary Java code.</p></section>`;
}

function connectConverter() {
  const controls = ["#convert-value", "#convert-from", "#convert-to"].map((selector) => view.querySelector(selector));
  controls.forEach((control) => control.addEventListener("input", updateConversion));
  controls.slice(1).forEach((control) => control.addEventListener("change", updateConversion));
  updateConversion();
}

function updateConversion() {
  const valueInput = view.querySelector("#convert-value");
  const from = view.querySelector("#convert-from").value;
  const to = view.querySelector("#convert-to").value;
  const output = view.querySelector("#convert-result");
  try {
    const raw = valueInput.value.trim();
    if (!raw || !Number.isFinite(Number(raw))) throw new Error("Enter a finite numeric value.");
    const result = javaCast(raw, from, to);
    output.textContent = `(${to}) ${formatJavaNumber(result)}${from === to ? "" : `  ·  ${from} → ${to}`}`;
    output.closest(".converter-result").classList.remove("invalid");
  } catch (error) {
    output.textContent = error.message;
    output.closest(".converter-result").classList.add("invalid");
  }
}

function javaCast(raw, from, to) {
  const floatingSource = from === "float" || from === "double";
  let value;
  if (floatingSource) {
    value = Number(raw);
    if (from === "float") value = Math.fround(value);
  } else {
    if (!/^[+-]?\d+$/.test(raw)) throw new Error(`${from} requires a whole-number value.`);
    value = BigInt(raw);
    const sourceBits = from === "byte" ? 8n : from === "short" ? 16n : from === "int" ? 32n : 64n;
    const sourceMin = -(2n ** (sourceBits - 1n));
    const sourceMax = 2n ** (sourceBits - 1n) - 1n;
    if (value < sourceMin || value > sourceMax) throw new Error(`${from} value is outside its Java range.`);
  }
  if (to === "double") return Number(value);
  if (to === "float") return Math.fround(Number(value));
  if (to === "long") {
    const min = -(2n ** 63n);
    const max = 2n ** 63n - 1n;
    if (floatingSource) {
      if (value >= Number(max)) return max;
      if (value <= Number(min)) return min;
      return BigInt(Math.trunc(value));
    }
    return value;
  }
  if (floatingSource) {
    const intMin = -2147483648n;
    const intMax = 2147483647n;
    const bounded = Math.max(Number(intMin), Math.min(Number(intMax), value));
    value = BigInt(Math.trunc(bounded));
    if (to === "int") return value;
  }
  const bits = to === "byte" ? 8n : to === "short" ? 16n : 32n;
  const integer = value;
  const modulus = 2n ** bits;
  const unsigned = ((integer % modulus) + modulus) % modulus;
  return unsigned >= modulus / 2n ? unsigned - modulus : unsigned;
}

function formatJavaNumber(value) {
  if (typeof value === "bigint") return value.toString();
  return Number.isInteger(value) ? value.toString() : value.toString();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function openLesson(id) {
  if (!id || !lessons.some((lesson) => lesson.id === id)) return;
  state.active = id;
  saveProgress();
  renderProgress();
  renderLesson();
  document.querySelector(".lesson-view").scrollIntoView({ behavior: "smooth", block: "start" });
}

function checkAnswer(lesson) {
  const selected = view.querySelector('input[name="answer"]:checked');
  const feedback = view.querySelector(".quiz-feedback");
  if (!selected) {
    feedback.textContent = "Pick an answer first, then check it.";
    feedback.className = "quiz-feedback feedback-hint";
    return;
  }
  const correct = Number(selected.value) === lesson.answer;
  feedback.textContent = correct ? `✓ ${lesson.feedback}` : "Not quite yet. Revisit the example and give it another try.";
  feedback.className = `quiz-feedback ${correct ? "feedback-correct" : "feedback-wrong"}`;
}

function completeLesson(lesson, index) {
  if (!state.completed.includes(lesson.id)) state.completed.push(lesson.id);
  saveProgress();
  renderProgress();
  if (index < lessons.length - 1) openLesson(lessons[index + 1].id);
  else renderLesson();
}

async function copyCode(code, button) {
  const label = button.querySelector("span");
  try {
    await navigator.clipboard.writeText(code);
    label.textContent = "Copied";
  } catch {
    label.textContent = "Select code";
  }
  window.setTimeout(() => { label.textContent = "Copy"; }, 1500);
}

document.querySelector("#about-button").addEventListener("click", () => dialog.showModal());
document.querySelector("#start-learning").addEventListener("click", () => dialog.close());
renderProgress();
renderLesson();
