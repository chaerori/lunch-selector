const STORAGE_KEY = "lunch-selector:restaurants";

const $ = (id) => document.getElementById(id);
const hero = document.querySelector(".hero");
const resultEl = $("result");
const metaEl = $("result-meta");
const resultLink = $("result-link");
const pickBtn = $("pick");
const sheet = $("sheet");

let restaurants = load();
let picked = false;
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
    ? "식당을 추가하면 패스할 음식을 고를 수 있어요."
    : excluded.size
      ? `패스한 음식은 빼고 ${n}곳 중에서 골라요.`
      : "오늘 당기지 않는 음식은 눌러서 빼 주세요.";
  pickBtn.disabled = n === 0;
}

function renderList() {
  $("count").textContent = restaurants.length ? restaurants.length : "";
  $("empty").hidden = restaurants.length > 0;
  $("list").replaceChildren(...restaurants.map((r, i) => {
    const li = document.createElement("li");

    const main = document.createElement("div");
    main.className = "row-main";
    const name = document.createElement("span");
    name.className = "row-name";
    name.textContent = r.name;
    const tag = document.createElement("span");
    tag.className = "row-tag";
    tag.textContent = r.category;
    main.append(name, tag);
    li.append(main);

    if (r.url) {
      const map = document.createElement("a");
      map.className = "row-map";
      map.textContent = "지도";
      map.href = r.url;
      map.target = "_blank";
      map.rel = "noopener noreferrer";
      map.setAttribute("aria-label", `${r.name} 지도 열기`);
      li.append(map);
    }

    const del = document.createElement("button");
    del.type = "button";
    del.className = "icon-btn";
    del.textContent = "✕";
    del.setAttribute("aria-label", `${r.name} 삭제`);
    del.onclick = () => { restaurants.splice(i, 1); save(); render(); };
    li.append(del);
    return li;
  }));
}

function renderIdle() {
  if (picked) return;
  resultEl.textContent = restaurants.length ? "오늘은 여기 어때요?" : "아직 후보가 없어요";
  metaEl.textContent = restaurants.length
    ? "버튼을 누르면 한 곳을 골라 드려요."
    : "자주 가는 식당을 추가하면 여기서 골라 드려요.";
}

function render() {
  renderFilters();
  renderList();
  renderIdle();
}

function show(r) {
  picked = true;
  pickBtn.textContent = "다시 뽑기";
  resultEl.textContent = r.name;
  metaEl.textContent = r.category;
  resultLink.hidden = !r.url;
  if (r.url) resultLink.href = r.url;
  hero.classList.remove("landed");
  void hero.offsetWidth;
  hero.classList.add("landed");
}

pickBtn.onclick = () => {
  const pool = candidates();
  const winner = pool[Math.floor(Math.random() * pool.length)];
  pickBtn.disabled = true;
  resultLink.hidden = true;
  hero.classList.add("rolling");
  let ticks = 0;
  const timer = setInterval(() => {
    const r = pool[Math.floor(Math.random() * pool.length)];
    resultEl.textContent = r.name;
    metaEl.textContent = r.category;
    if (++ticks >= 12) {
      clearInterval(timer);
      hero.classList.remove("rolling");
      show(winner);
      pickBtn.disabled = false;
    }
  }, 80);
};

$("open-add").onclick = () => { sheet.showModal(); $("name").focus(); };
$("close-add").onclick = () => sheet.close();
sheet.addEventListener("click", (e) => { if (e.target === sheet) sheet.close(); });

$("add-form").onsubmit = (e) => {
  e.preventDefault();
  const name = $("name").value.trim();
  const category = $("category").value.trim();
  const url = $("url").value.trim();
  if (url && !isHttpUrl(url)) {
    $("url").setCustomValidity("http:// 또는 https://로 시작하는 지도 링크를 넣어 주세요.");
    $("url").reportValidity();
    return;
  }
  if (restaurants.some((r) => r.name === name && r.category === category)) {
    $("name").setCustomValidity("이미 있는 식당이에요.");
    $("name").reportValidity();
    return;
  }
  restaurants.push({ name, category, url });
  save();
  e.target.reset();
  sheet.close();
  render();
};

for (const id of ["name", "url"]) {
  $(id).oninput = (e) => e.target.setCustomValidity("");
}

render();
