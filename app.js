const PENCIL_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/></svg>';
const SAVE_ERROR = "저장하지 못했어요. 잠시 후 다시 시도해 주세요.";

const { url: API_URL, key: API_KEY } = window.SUPABASE;

const $ = (id) => document.getElementById(id);
const hero = document.querySelector(".hero");
const art = document.querySelector(".hero-art");
const resultEl = $("result");
const metaEl = $("result-meta");
const resultLink = $("result-link");
const pickBtn = $("pick");
const sheet = $("sheet");

let restaurants = [];
let state = "loading"; // loading | ready | error
let picked = false;
let lastPickedId = null;
let editingId = null;
const excluded = new Set();

async function api(path = "", options = {}) {
  const res = await fetch(`${API_URL}/rest/v1/restaurants${path}`, {
    ...options,
    headers: {
      apikey: API_KEY,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

function setStatus(text = "") {
  $("status").textContent = text;
  $("status").hidden = !text;
}

async function refresh() {
  try {
    restaurants = await api("?select=*&order=created_at.asc");
    state = "ready";
    setStatus();
  } catch {
    if (state !== "ready") state = "error";
  }
  render();
}

function isHttpUrl(value) {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

const parseCategories = (text) => [...new Set(text.split(/[,，]/).map((c) => c.trim()).filter(Boolean))];
const categories = () => [...new Set(restaurants.flatMap((r) => r.categories))].sort();
const candidates = () => restaurants.filter((r) => !r.categories.some((c) => excluded.has(c)));

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
  $("filter-hint").textContent = state !== "ready"
    ? ""
    : !restaurants.length
      ? "식당을 추가하면 패스할 음식을 고를 수 있어요."
      : excluded.size
        ? `패스한 음식은 빼고 ${n}곳 중에서 골라요.`
        : "오늘 당기지 않는 음식은 눌러서 빼 주세요.";
  pickBtn.disabled = n === 0;
}

function renderList() {
  $("count").textContent = restaurants.length ? restaurants.length : "";
  $("empty").hidden = state !== "ready" || restaurants.length > 0;
  $("list").replaceChildren(...restaurants.map((r) => {
    const li = document.createElement("li");

    const main = document.createElement("div");
    main.className = "row-main";
    const name = document.createElement("span");
    name.className = "row-name";
    name.textContent = r.name;
    const tag = document.createElement("span");
    tag.className = "row-tag";
    tag.textContent = r.categories.join(", ");
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

    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "icon-btn";
    edit.innerHTML = PENCIL_ICON;
    edit.setAttribute("aria-label", `${r.name} 수정`);
    edit.onclick = () => openSheet(r);
    li.append(edit);

    const del = document.createElement("button");
    del.type = "button";
    del.className = "icon-btn";
    del.textContent = "✕";
    del.setAttribute("aria-label", `${r.name} 삭제`);
    del.onclick = async () => {
      del.disabled = true;
      try {
        await api(`?id=eq.${r.id}`, { method: "DELETE" });
        restaurants = restaurants.filter((x) => x.id !== r.id);
        setStatus();
        render();
      } catch {
        del.disabled = false;
        setStatus(SAVE_ERROR);
      }
    };
    li.append(del);
    return li;
  }));
}

function renderIdle() {
  if (picked) return;
  if (state === "loading") {
    resultEl.textContent = "목록을 불러오는 중이에요";
    metaEl.textContent = "";
  } else if (state === "error") {
    resultEl.textContent = "목록을 불러오지 못했어요";
    metaEl.textContent = "새로고침하거나 잠시 후 다시 열어 주세요.";
  } else {
    resultEl.textContent = restaurants.length ? "오늘은 여기 어때요?" : "아직 후보가 없어요";
    metaEl.textContent = restaurants.length
      ? "버튼을 누르면 한 곳을 골라 드려요."
      : "자주 가는 식당을 추가하면 여기서 골라 드려요.";
  }
}

function render() {
  renderFilters();
  renderList();
  renderIdle();
}

function show(r) {
  picked = true;
  lastPickedId = r.id;
  art.innerHTML = iconFor(r.categories);
  pickBtn.textContent = "다시 뽑기";
  resultEl.textContent = r.name;
  metaEl.textContent = r.categories.join(", ");
  resultLink.hidden = !r.url;
  if (r.url) resultLink.href = r.url;
  hero.classList.remove("landed");
  void hero.offsetWidth;
  hero.classList.add("landed");
}

pickBtn.onclick = () => {
  const pool = candidates();
  const fresh = pool.filter((r) => r.id !== lastPickedId);
  const choices = fresh.length ? fresh : pool;
  const winner = choices[Math.floor(Math.random() * choices.length)];
  pickBtn.disabled = true;
  resultLink.hidden = true;
  hero.classList.add("rolling");
  let ticks = 0;
  const timer = setInterval(() => {
    const r = pool[Math.floor(Math.random() * pool.length)];
    resultEl.textContent = r.name;
    metaEl.textContent = r.categories.join(", ");
    art.innerHTML = iconFor(r.categories);
    if (++ticks >= 12) {
      clearInterval(timer);
      hero.classList.remove("rolling");
      show(winner);
      pickBtn.disabled = false;
    }
  }, 80);
};

function openSheet(r = null) {
  editingId = r?.id ?? null;
  $("sheet-title").textContent = r ? "식당 수정" : "새 식당 추가";
  $("submit-btn").textContent = r ? "저장" : "추가";
  if (r) {
    $("name").value = r.name;
    $("category").value = r.categories.join(", ");
    $("url").value = r.url;
  }
  sheet.showModal();
  $("name").focus();
}

$("open-add").onclick = () => openSheet();
sheet.addEventListener("close", () => {
  editingId = null;
  $("add-form").reset();
  for (const id of ["name", "category", "url"]) $(id).setCustomValidity("");
});
$("close-add").onclick = () => sheet.close();
sheet.addEventListener("click", (e) => { if (e.target === sheet) sheet.close(); });

$("add-form").onsubmit = async (e) => {
  e.preventDefault();
  const name = $("name").value.trim();
  const categories = parseCategories($("category").value);
  const url = $("url").value.trim();
  const id = editingId;
  if (!categories.length) {
    $("category").setCustomValidity("카테고리를 하나 이상 입력해 주세요.");
    $("category").reportValidity();
    return;
  }
  if (url && !isHttpUrl(url)) {
    $("url").setCustomValidity("http:// 또는 https://로 시작하는 지도 링크를 넣어 주세요.");
    $("url").reportValidity();
    return;
  }
  if (restaurants.some((r) => r.id !== id && r.name === name && r.categories.join() === categories.join())) {
    $("name").setCustomValidity("이미 있는 식당이에요.");
    $("name").reportValidity();
    return;
  }

  const body = JSON.stringify({ name, categories, url });
  $("submit-btn").disabled = true;
  try {
    if (id === null) {
      const [row] = await api("", { method: "POST", body });
      restaurants.push(row);
    } else {
      const [row] = await api(`?id=eq.${id}`, { method: "PATCH", body });
      if (!row) throw new Error("missing");
      restaurants = restaurants.map((r) => (r.id === id ? row : r));
    }
    setStatus();
    sheet.close();
    render();
  } catch {
    $("name").setCustomValidity(SAVE_ERROR);
    $("name").reportValidity();
  } finally {
    $("submit-btn").disabled = false;
  }
};

for (const id of ["name", "category", "url"]) {
  $(id).oninput = (e) => e.target.setCustomValidity("");
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") refresh();
});

art.innerHTML = ICONS.rice;
render();
refresh();
