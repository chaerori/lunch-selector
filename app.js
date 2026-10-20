const STORAGE_KEY = "lunch-selector:restaurants";

const $ = (id) => document.getElementById(id);
const resultEl = $("result");
const resultLink = $("result-link");
const pickBtn = $("pick");

let restaurants = load();
const excluded = new Set();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch {}
  return [];
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants)); } catch {}
}

function isHttpUrl(value) {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

const categories = () => [...new Set(restaurants.map((r) => r.category))].sort();
const candidates = () => restaurants.filter((r) => !excluded.has(r.category));

function renderFilters() {
  const cats = categories();
  for (const c of excluded) if (!cats.includes(c)) excluded.delete(c);

  $("filters").replaceChildren(...cats.map((c) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = c;
    chip.setAttribute("aria-pressed", excluded.has(c));
    chip.onclick = () => {
      excluded.has(c) ? excluded.delete(c) : excluded.add(c);
      render();
    };
    return chip;
  }));
  $("category-options").replaceChildren(...cats.map((c) => new Option(c)));

  const n = candidates().length;
  $("filter-hint").textContent = !restaurants.length
    ? "식당을 추가하면 제외할 카테고리를 고를 수 있어요."
    : excluded.size
      ? `선택한 카테고리는 제외돼요. 뽑을 수 있는 식당 ${n}곳`
      : "제외할 카테고리를 누르세요.";
  pickBtn.disabled = n === 0;
}

function renderList() {
  $("count").textContent = `(${restaurants.length})`;
  $("list").replaceChildren(...restaurants.map((r, i) => {
    const li = document.createElement("li");
    const info = document.createElement("div");

    const name = document.createElement(r.url ? "a" : "span");
    name.textContent = r.name;
    if (r.url) {
      name.href = r.url;
      name.target = "_blank";
      name.rel = "noopener noreferrer";
    }
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = r.category;
    info.append(name, tag);

    const del = document.createElement("button");
    del.type = "button";
    del.className = "del";
    del.textContent = "✕";
    del.setAttribute("aria-label", `${r.name} 삭제`);
    del.onclick = () => { restaurants.splice(i, 1); save(); render(); };

    li.append(info, del);
    return li;
  }));
}

function render() {
  renderFilters();
  renderList();
}

function show(r) {
  resultEl.textContent = r.name;
  const tag = document.createElement("small");
  tag.textContent = r.category;
  resultEl.append(tag);
  resultLink.hidden = !r.url;
  if (r.url) resultLink.href = r.url;
}

pickBtn.onclick = () => {
  const pool = candidates();
  const winner = pool[Math.floor(Math.random() * pool.length)];
  pickBtn.disabled = true;
  resultLink.hidden = true;
  resultEl.classList.add("rolling");
  let ticks = 0;
  const timer = setInterval(() => {
    resultEl.textContent = pool[Math.floor(Math.random() * pool.length)].name;
    if (++ticks >= 12) {
      clearInterval(timer);
      resultEl.classList.remove("rolling");
      show(winner);
      pickBtn.disabled = false;
    }
  }, 80);
};

$("add-form").onsubmit = (e) => {
  e.preventDefault();
  const name = $("name").value.trim();
  const category = $("category").value.trim();
  const url = $("url").value.trim();
  if (url && !isHttpUrl(url)) {
    $("url").setCustomValidity("http:// 또는 https:// 로 시작하는 주소를 입력해 주세요.");
    $("url").reportValidity();
    return;
  }
  if (restaurants.some((r) => r.name === name && r.category === category)) {
    $("name").setCustomValidity("이미 추가된 식당이에요.");
    $("name").reportValidity();
    return;
  }
  restaurants.push({ name, category, url });
  save();
  e.target.reset();
  render();
};

for (const id of ["name", "url"]) {
  $(id).oninput = (e) => e.target.setCustomValidity("");
}

render();
