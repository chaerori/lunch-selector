// 결과 카드에 쓰는 음식 픽토그램 (viewBox 0 0 96 96)
const STEAM = `<g fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".9"><path d="M34 26c-5-5 5-8 0-14"/><path d="M48 24c-5-5 5-8 0-14"/><path d="M62 26c-5-5 5-8 0-14"/></g>`;
const BOWL = `<path d="M10 52h76c0 20-15 34-38 34S10 72 10 52z" fill="#c8631a"/><path d="M17 62h62" stroke="#ffd9a3" stroke-width="3" stroke-linecap="round"/><path d="M36 86h24v4H36z" fill="#c8631a"/>`;
const CHOPSTICKS = `<g stroke="#7a3f0a" stroke-width="3.5" stroke-linecap="round"><path d="M60 40 90 12"/><path d="M68 44 94 20"/></g>`;

const ICONS = {
  // 한식·기본: 밥
  rice: `${STEAM}<path d="M18 52c0-15 12-24 30-24s30 9 30 24z" fill="#fff"/>${CHOPSTICKS}${BOWL}`,

  // 면 요리
  noodle: `${STEAM}<path d="M18 52c0-15 12-24 30-24s30 9 30 24z" fill="#ffe9a8"/><g fill="none" stroke="#e0b44c" stroke-width="2.5" stroke-linecap="round"><path d="M24 46c5-4 9 4 14 0s9 4 14 0 9 4 14 0 6 2 8 0"/><path d="M26 38c6-4 10 4 16 0s10 4 16 0 6 2 8 0"/></g>${CHOPSTICKS}${BOWL}`,

  // 국·찌개·탕
  soup: `${STEAM}<path d="M14 44h68v22c0 10-8 18-18 18H32c-10 0-18-8-18-18z" fill="#8a4a1a"/><path d="M6 48h8v6H6zM82 48h8v6h-8z" fill="#8a4a1a"/><ellipse cx="48" cy="44" rx="32" ry="8" fill="#d9482b"/><rect x="33" y="40" width="10" height="9" rx="2" fill="#fff"/><rect x="53" y="41" width="10" height="9" rx="2" fill="#fff"/><path d="M22 66h52" stroke="#ffd9a3" stroke-width="3" stroke-linecap="round"/>`,

  // 초밥·일식
  sushi: `<rect x="18" y="56" width="60" height="24" rx="12" fill="#fff"/><path d="M12 58c0-14 14-22 36-22s36 8 36 22c0 4-4 6-8 6H20c-4 0-8-2-8-6z" fill="#ff7a59"/><path d="M28 48c6-3 10 3 14 0" fill="none" stroke="#ffd0c2" stroke-width="3" stroke-linecap="round"/><rect x="44" y="40" width="10" height="42" rx="2" fill="#3a3f3a"/><path d="M12 88h72" stroke="#7a3f0a" stroke-width="3" stroke-linecap="round"/>`,

  // 만두·중식
  dumpling: `${STEAM}<path d="M10 70c0-26 16-40 38-40s38 14 38 40c0 6-4 10-10 10H20c-6 0-10-4-10-10z" fill="#fff"/><g fill="none" stroke="#ffd9a3" stroke-width="3" stroke-linecap="round"><path d="M27 44l5 10"/><path d="M39 38l3 13"/><path d="M52 37l-2 14"/><path d="M64 42l-5 11"/></g><path d="M10 82h76" stroke="#7a3f0a" stroke-width="3" stroke-linecap="round"/>`,

  // 피자·양식
  pizza: `<path d="M10 28c26-12 50-12 76 0L48 88z" fill="#ffe08a"/><path d="M8 24c28-14 52-14 80 0l-3 9c-26-10-48-10-74 0z" fill="#d98a3d"/><circle cx="36" cy="46" r="6" fill="#d9482b"/><circle cx="58" cy="42" r="6" fill="#d9482b"/><circle cx="48" cy="64" r="6" fill="#d9482b"/>`,

  // 햄버거
  burger: `<path d="M14 44c0-18 16-26 34-26s34 8 34 26z" fill="#e59a3d"/><g fill="#fff"><ellipse cx="34" cy="32" rx="3.5" ry="2"/><ellipse cx="48" cy="26" rx="3.5" ry="2"/><ellipse cx="62" cy="32" rx="3.5" ry="2"/><ellipse cx="41" cy="38" rx="3.5" ry="2"/><ellipse cx="56" cy="38" rx="3.5" ry="2"/></g><path d="M10 48c6 5 10-3 15 2s10-3 15 2 10-3 15 2 10-3 15 2 10-3 16 0v4H10z" fill="#6cb35d"/><rect x="12" y="56" width="72" height="12" rx="6" fill="#7a3f0a"/><path d="M14 70h68v6c0 6-4 10-10 10H24c-6 0-10-4-10-10z" fill="#e59a3d"/>`,

  // 치킨
  chicken: `<path d="M52 60 76 84" stroke="#fff" stroke-width="8" stroke-linecap="round"/><circle cx="80" cy="80" r="6" fill="#fff"/><circle cx="72" cy="88" r="6" fill="#fff"/><ellipse cx="40" cy="42" rx="30" ry="22" fill="#d98a2b" transform="rotate(-35 40 42)"/><path d="M22 34c4-8 12-12 20-12" fill="none" stroke="#ffd08a" stroke-width="4" stroke-linecap="round"/>`,

  // 고기·구이
  meat: `<path d="M14 52c0-18 14-28 34-28 24 0 36 12 36 28 0 16-14 26-32 26S14 68 14 52z" fill="#c8472f" stroke="#ffd9c2" stroke-width="5"/><g stroke="#7a2a1a" stroke-width="3" stroke-linecap="round"><path d="M34 40l20 24"/><path d="M46 36l22 26"/><path d="M26 50l16 18"/></g>`,

  // 카페·디저트
  coffee: `<g fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".9"><path d="M36 26c-5-5 5-8 0-14"/><path d="M50 24c-5-5 5-8 0-14"/></g><path d="M68 46h6c8 0 12 5 12 11s-4 11-12 11h-8" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M18 38h50v24c0 14-10 24-25 24S18 76 18 62z" fill="#fff"/><ellipse cx="43" cy="38" rx="25" ry="6" fill="#7a3f0a"/><ellipse cx="43" cy="90" rx="34" ry="4" fill="#c8631a"/>`,

  // 멕시칸
  taco: `<path d="M12 58Q17 40 26 48T40 41T54 37T68 42T83 47L84 58Z" fill="#6cb35d"/><circle cx="32" cy="50" r="4" fill="#d9482b"/><circle cx="52" cy="45" r="4" fill="#d9482b"/><circle cx="70" cy="50" r="4" fill="#d9482b"/><path d="M8 58h80c0 22-18 32-40 32S8 80 8 58z" fill="#f2c14e"/><path d="M8 58h80" stroke="#e0a82e" stroke-width="4" stroke-linecap="round"/><path d="M20 70c6 8 14 12 28 12" fill="none" stroke="#fff3c4" stroke-width="3" stroke-linecap="round"/>`,

  // 샐러드
  salad: `<path d="M16 52c-2-10 6-18 14-16 2-8 14-12 20-4 8-6 20 0 18 10 8 2 12 8 10 10z" fill="#6cb35d"/><circle cx="36" cy="44" r="6" fill="#d9482b"/><circle cx="60" cy="42" r="5" fill="#d9482b"/>${BOWL}`,
};

// 위에 있을수록 우선. 카테고리가 여러 개면 가장 위 규칙에 걸린 아이콘을 씁니다.
const ICON_RULES = [
  ["noodle", ["면", "국수", "라멘", "라면", "우동", "냉면", "파스타", "짬뽕", "짜장", "소바", "아시안", "베트남", "태국", "팟타이"]],
  ["dumpling", ["만두", "딤섬", "중식", "중국", "마라", "탕수육"]],
  ["soup", ["국밥", "찌개", "탕", "전골", "해장", "국물", "순대국", "순댓국"]],
  ["sushi", ["초밥", "스시", "회", "일식", "오마카세", "사시미"]],
  ["pizza", ["피자", "이탈리"]],
  ["burger", ["버거", "패스트푸드"]],
  ["taco", ["멕시칸", "멕시코", "타코", "부리또"]],
  ["chicken", ["치킨", "닭"]],
  ["meat", ["고기", "구이", "삼겹", "갈비", "바비큐", "스테이크", "곱창", "족발", "보쌈"]],
  ["coffee", ["카페", "커피", "디저트", "빵", "베이커리", "브런치"]],
  ["salad", ["샐러드", "비건", "샌드위치"]],
  ["pizza", ["양식"]],
];

function iconFor(categories) {
  const rule = ICON_RULES.find(([, words]) =>
    categories.some((c) => words.some((w) => c.includes(w))));
  return ICONS[rule ? rule[0] : "rice"];
}
