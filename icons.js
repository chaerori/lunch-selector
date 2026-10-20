// 결과 카드에 쓰는 음식 픽토그램 (viewBox 0 0 96 96)
// 공통 스타일: 굵은 진한 외곽선 + 평평한 채색 + 한쪽 면 음영
const INK = "#2b1d14";
const g = (inner) => `<g stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">${inner}</g>`;
// 외곽선이 있는 굵은 선(면발, 뼈, 손잡이): 검정 선 위에 색 선을 덧그림
const pipe = (d, w, color) =>
  `<path d="${d}" fill="none" stroke-width="${w}"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w - 3.6}"/>`;
const STEAM = `<g fill="none"><path d="M32 22c-4-4 4-7 0-12"/><path d="M48 20c-4-4 4-7 0-12"/><path d="M64 22c-4-4 4-7 0-12"/></g>`;
const dots = (list) => `<g fill="${INK}" stroke="none">${list.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4"/>`).join("")}</g>`;
const RICE_BUMPS = [[10, 46], [20.8, 54], [31.6, 62], [42.4, 70], [53.2, 78], [64, 86]]
  .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#faf5f0"/>`).join("");

const ICONS = {
  // 한식·기본: 김이 나는 밥
  rice: g(`${STEAM}<path d="M14 52c0-12 8-20 18-20 3-7 13-9 19-4 4-4 13-3 16 5 9 2 15 10 15 19z" fill="#fff"/><path d="M8 52h80c0 20-16 34-40 34S8 72 8 52z" fill="#cfe3ff"/><path d="M71 55h14c-3 16-17 28-37 28 14-6 23-16 23-28z" fill="#a9c8f5" stroke="none"/><path d="M36 86h24v6H36z" fill="#a9c8f5"/>`),

  // 면 요리: 젓가락으로 든 면발
  noodle: g(`<path d="M20 34 82 10l3 7-62 24z" fill="#f28c38"/><path d="M16 44 82 24l3 7-66 22z" fill="#f28c38"/>${pipe("M34 40c-4 6 4 10 0 16s4 8 0 12", 7, "#fff")}${pipe("M46 38c-4 6 4 10 0 16s4 8 0 14", 7, "#fff")}${pipe("M58 36c-4 6 4 10 0 16s4 8 0 16", 7, "#fff")}${pipe("M70 34c-4 6 4 10 0 16s4 8 0 18", 7, "#fff")}<path d="M8 62h80c0 16-14 26-40 26S8 78 8 62z" fill="#86a8f0"/><path d="M72 65h13c-3 14-15 23-37 23 14-5 24-12 24-23z" fill="#6e91dd" stroke="none"/><path d="M36 88h24v5H36z" fill="#6e91dd"/>`),

  // 라멘·일식
  ramen: g(`<path d="M22 6h56v9H22z" fill="#e85d4c"/>${pipe("M38 15c-4 6 4 10 0 16s4 10 0 18", 7, "#ffb13b")}${pipe("M48 15c-4 6 4 10 0 16s4 10 0 18", 7, "#ffb13b")}${pipe("M58 15c-4 6 4 10 0 16s4 10 0 18", 7, "#ffb13b")}${pipe("M68 15c-4 6 4 10 0 16s4 10 0 18", 7, "#ffb13b")}<ellipse cx="22" cy="47" rx="14" ry="10" fill="#fff"/><circle cx="20" cy="49" r="5" fill="#ffa52b" stroke="none"/><path d="M66 52 76 34l16 8-4 10z" fill="#3f4c6b"/><path d="M6 52h84c0 20-16 34-42 34S6 72 6 52z" fill="#e85d4c"/><path d="M73 55h14c-3 17-16 28-39 28 15-6 25-16 25-28z" fill="#d24a3b" stroke="none"/><path d="M36 86h24v6H36z" fill="#e85d4c"/>`),

  // 국·찌개·탕: 뚝배기
  soup: g(`${STEAM}<path d="M2 52h8v8H2zM86 52h8v8h-8z" fill="#8a4a1a"/><path d="M10 46h76v22c0 12-10 20-22 20H32c-12 0-22-8-22-20z" fill="#a0592b"/><path d="M70 56h14v12c0 12-10 20-22 20 8-6 8-20 8-32z" fill="#8a4a1a" stroke="none"/><ellipse cx="48" cy="46" rx="38" ry="8" fill="#e85d4c"/><rect x="30" y="39" width="11" height="9" rx="2" fill="#fff"/><rect x="52" y="40" width="11" height="9" rx="2" fill="#fff"/>`),

  // 초밥·스시: 연어 니기리
  sushi: g(`${RICE_BUMPS}<path d="M10 30 70 86H64L10 46z" fill="#faf5f0" stroke="none"/><path d="M6 20C10 10 24 4 38 6c26 4 48 30 54 66 0 8-6 14-14 14l-8-2C52 70 28 52 12 32 8 28 5 24 6 20z" fill="#ff9b72"/><path d="M62 12c18 12 28 32 28 58 0 2-1 4-3 5C84 48 74 28 56 14z" fill="#ff8346" stroke="none"/><path d="M34 7c5 5 4 11-2 17M54 14c6 5 6 13-1 19M72 30c7 6 6 15-2 22M84 54c5 4 4 11-1 16" fill="none"/>`),

  // 만두·중식
  dumpling: g(`${STEAM}<path d="M8 70C8 44 26 30 48 30s40 14 40 40c0 6-4 10-10 10H18C12 80 8 76 8 70z" fill="#fff3de"/><path d="M68 40C80 48 84 58 84 70c0 5-3 8-8 8H62c10-10 12-26 6-38z" fill="#f2ddbe" stroke="none"/><path d="M28 44l4 10M40 38l2 12M54 38l-2 12M66 44l-4 10" fill="none"/>`),

  // 피자
  pizza: g(`<path d="M8 30C32 14 64 14 88 30l-6 10C60 28 36 28 14 40z" fill="#f6c46b"/><path d="M14 40C36 28 60 28 82 40L52 88z" fill="#ffe8c2"/><path d="M82 40 52 88l8-52z" fill="#fbd59e" stroke="none"/><circle cx="38" cy="52" r="7" fill="#f4747c"/><circle cx="62" cy="54" r="7" fill="#f4747c"/><circle cx="50" cy="72" r="6" fill="#f4747c"/>${dots([[36, 51], [40, 54], [60, 52], [64, 56], [49, 71]])}`),

  // 햄버거
  burger: g(`<path d="M12 42C12 24 28 14 48 14s36 10 36 28z" fill="#f5983a"/><path d="M70 20c9 5 14 12 14 22H64c5-6 7-14 6-22z" fill="#e8802a" stroke="none"/><path d="M35 27l2 3M48 23v4M61 27l-2 3" fill="none"/><rect x="8" y="44" width="80" height="12" rx="6" fill="#a0592b"/><path d="M8 62c4-3 8 3 12 0s8 3 12 0 8 3 12 0 8 3 12 0 8 3 12 0 6 2 8 0v8H8z" fill="#8ed35f"/><path d="M12 56h72v4H62v10c0 4-8 4-8 0V60H12z" fill="#ffd54a"/><path d="M12 72h72v6c0 8-6 12-14 12H26c-8 0-14-4-14-12z" fill="#f5983a"/><path d="M68 74h14v4c0 8-6 12-14 12 4-4 4-10 0-16z" fill="#e8802a" stroke="none"/>`),

  // 치킨
  chicken: g(`${pipe("M52 54 78 80", 13, "#fff")}<circle cx="82" cy="78" r="7" fill="#fff"/><circle cx="74" cy="86" r="7" fill="#fff"/><path d="M10 38C10 18 28 8 46 12c16 4 24 20 18 36-4 10-12 14-22 14S10 54 10 38z" fill="#f2893a"/><path d="M20 28c3-6 8-9 14-10" fill="none" stroke="#ffd9a0"/>`),

  // 고기·구이·스테이크
  meat: g(`<circle cx="48" cy="48" r="40" fill="#ddf1fb"/><path d="M22 30c-2-8 6-12 12-8 4-6 14-2 12 6 6 0 8 8 2 10H26c-4 0-6-4-4-8z" fill="#5fbf6a"/><circle cx="40" cy="34" r="4" fill="#f4747c"/><path d="M64 34h16v6H64zM60 42h16v6H60z" fill="#ffc14d"/><path d="M16 60c-4-14 8-24 24-22 14 2 20 8 34 8 8 0 10 8 4 14-10 14-30 20-48 14-8-3-12-8-14-14z" fill="#c96a30"/><path d="M30 48l14 18M42 44l16 20M54 44l14 16" fill="none" stroke="#8a4420"/>`),

  // 카페·디저트
  coffee: g(`<g fill="none"><path d="M36 28c-4-4 4-7 0-12"/><path d="M50 26c-4-4 4-7 0-12"/></g>${pipe("M66 46h6c8 0 12 5 12 11s-4 11-12 11h-6", 11, "#fff")}<ellipse cx="42" cy="90" rx="36" ry="5" fill="#dce6fa"/><path d="M16 40h50v22c0 14-10 24-25 24S16 76 16 62z" fill="#fff"/><path d="M52 43h12v19c0 13-9 23-23 24 8-8 11-24 11-43z" fill="#e6e8f2" stroke="none"/><ellipse cx="41" cy="40" rx="25" ry="6" fill="#8a5a2b"/>`),

  // 샐러드
  salad: g(`<path d="M14 54C8 38 20 24 32 28c4-10 20-12 28-4 12-2 22 8 18 20 4 4 4 8 2 10z" fill="#7ed957"/><path d="M24 52c-2-10 6-18 14-14 4-4 10-2 12 2" fill="none"/><path d="M50 50 70 34l8 8-16 16z" fill="#f4747c"/><circle cx="76" cy="46" r="6" fill="#ffd54a"/><path d="M8 54h80c0 20-14 30-40 30S8 74 8 54z" fill="#f2f2fc"/><path d="M74 57h13c-3 18-15 27-39 27 14-6 26-14 26-27z" fill="#dcdcee" stroke="none"/><path d="M34 84h28v6H34z" fill="#dcdcee"/>`),

  // 멕시칸: 타코
  taco: g(`<path d="M24 46c0-8 8-12 14-8 4-8 14-8 18-2 6-4 14 0 14 8 6 2 10 8 8 14H24z" fill="#8ed35f"/><circle cx="62" cy="34" r="7" fill="#e85d4c"/><path d="M8 82C8 52 26 36 48 36s40 16 40 46z" fill="#f6d89a"/><path d="M62 42C76 48 84 62 84 80H62C70 68 70 54 62 42z" fill="#efc670" stroke="none"/><path d="M28 66l4-4M42 56l4-4M40 72l4-4M56 64l4-4" fill="none"/>`),

  // 돈까스·카츠
  katsu: g(`<circle cx="48" cy="48" r="40" fill="#fbe6cc"/><g transform="rotate(-14 48 46)"><rect x="18" y="28" width="13" height="36" rx="6" fill="#f2793a"/><rect x="21" y="32" width="7" height="28" rx="3" fill="#ffe2b8" stroke="none"/><rect x="33" y="26" width="13" height="38" rx="6" fill="#f2793a"/><rect x="36" y="30" width="7" height="30" rx="3" fill="#ffe2b8" stroke="none"/><rect x="48" y="26" width="13" height="38" rx="6" fill="#f2793a"/><rect x="51" y="30" width="7" height="30" rx="3" fill="#ffe2b8" stroke="none"/><rect x="63" y="28" width="13" height="36" rx="6" fill="#f2793a"/><rect x="66" y="32" width="7" height="28" rx="3" fill="#ffe2b8" stroke="none"/></g><circle cx="38" cy="74" r="8" fill="#fff"/><circle cx="38" cy="74" r="4.2" fill="#8a3f20" stroke="none"/><circle cx="58" cy="74" r="8" fill="#fff"/><circle cx="58" cy="74" r="4.2" fill="#e8473a" stroke="none"/>`),

  // 파스타·양식
  pasta: g(`<ellipse cx="48" cy="84" rx="42" ry="8" fill="#dce6fa"/>${pipe("M40 18c-4 8 4 12 0 20s4 12 0 20", 8, "#ffc14d")}${pipe("M50 16c-4 8 4 12 0 20s4 12 0 22", 8, "#ffc14d")}${pipe("M60 18c-4 8 4 12 0 20s4 12 0 20", 8, "#ffc14d")}<path d="M12 82C10 64 24 54 48 54s38 10 36 28z" fill="#ffc14d"/><path d="M22 80c0-9 6-14 12-14s12 5 12 14M44 80c0-9 6-14 12-14s12 5 12 14M60 62c6 2 10 6 12 12" fill="none"/><path d="M30 8 76 14l-1 8-46-6z" fill="#4a4f57"/>`),

  // 함박·경양식
  hamburg: g(`<circle cx="48" cy="48" r="40" fill="#d3e1ea"/><path d="M54 24c20 2 30 14 28 30-2 16-14 22-28 22 10-10 12-30 0-52z" fill="#ffd54a"/><path d="M60 38c8 4 10 12 6 20M66 32c10 8 12 22 4 34" fill="none"/><path d="M14 50c-2-14 8-26 22-26 12 0 18 8 18 20 0 16-10 28-24 28S16 66 14 50z" fill="#7a4a22"/><path d="M28 40l8 4M30 46l8 4M26 58l10-4" fill="none" stroke="#c9a06b"/>`),
};

// 위에 있을수록 우선. 카테고리가 여러 개면 가장 위 규칙에 걸린 아이콘을 씁니다.
const ICON_RULES = [
  ["ramen", ["라멘"]],
  ["pasta", ["파스타", "스파게티"]],
  ["hamburg", ["함박", "경양식"]],
  ["noodle", ["면", "국수", "라면", "우동", "냉면", "짬뽕", "짜장", "소바", "아시안", "베트남", "태국", "팟타이"]],
  ["dumpling", ["만두", "딤섬", "중식", "중국", "마라", "탕수육"]],
  ["soup", ["국밥", "찌개", "탕", "전골", "해장", "국물", "순대국", "순댓국"]],
  ["sushi", ["초밥", "스시", "회", "오마카세", "사시미"]],
  ["pizza", ["피자", "이탈리"]],
  ["burger", ["버거", "패스트푸드"]],
  ["taco", ["멕시칸", "멕시코", "타코", "부리또"]],
  ["katsu", ["카츠", "돈까스", "돈가스", "커틀릿", "튀김"]],
  ["chicken", ["치킨", "닭"]],
  ["meat", ["고기", "구이", "삼겹", "갈비", "바비큐", "스테이크", "곱창", "족발", "보쌈"]],
  ["coffee", ["카페", "커피", "디저트", "빵", "베이커리", "브런치"]],
  ["salad", ["샐러드", "비건", "샌드위치"]],
  ["pasta", ["양식"]],
  ["ramen", ["일식"]],
];

function iconFor(categories) {
  const rule = ICON_RULES.find(([, words]) =>
    categories.some((c) => words.some((w) => c.includes(w))));
  return ICONS[rule ? rule[0] : "rice"];
}
