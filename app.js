const DEFAULT_MENUS = ["김치찌개", "된장찌개", "비빔밥", "제육볶음", "돈까스", "칼국수", "순두부찌개", "냉면", "초밥", "햄버거", "쌀국수", "샐러드"];
const STORAGE_KEY = "lunch-selector:menus";

const $ = (id) => document.getElementById(id);
const resultEl = $("result");
const pickBtn = $("pick");

let menus = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch {}
  return [...DEFAULT_MENUS];
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(menus)); } catch {}
}

function render() {
  $("count").textContent = `(${menus.length})`;
  $("list").replaceChildren(...menus.map((name, i) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = name;
    const del = document.createElement("button");
    del.type = "button";
    del.className = "del";
    del.textContent = "✕";
    del.setAttribute("aria-label", `${name} 삭제`);
    del.onclick = () => { menus.splice(i, 1); save(); render(); };
    li.append(span, del);
    return li;
  }));
  pickBtn.disabled = menus.length === 0;
}

pickBtn.onclick = () => {
  pickBtn.disabled = true;
  resultEl.classList.add("rolling");
  const winner = menus[Math.floor(Math.random() * menus.length)];
  let ticks = 0;
  const timer = setInterval(() => {
    resultEl.textContent = menus[Math.floor(Math.random() * menus.length)];
    if (++ticks >= 12) {
      clearInterval(timer);
      resultEl.textContent = winner;
      resultEl.classList.remove("rolling");
      pickBtn.disabled = false;
    }
  }, 80);
};

$("add-form").onsubmit = (e) => {
  e.preventDefault();
  const name = $("add-input").value.trim();
  if (name && !menus.includes(name)) {
    menus.push(name);
    save();
    render();
  }
  $("add-input").value = "";
};

$("reset").onclick = () => { menus = [...DEFAULT_MENUS]; save(); render(); };

render();
