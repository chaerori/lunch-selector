// 결과 카드에 쓰는 음식 아이콘 (icons/*.svg, Fluent Emoji Flat · MIT, 자세한 내용은 icons/README.md)
const ICON_NAMES = ["rice", "noodle", "soup", "sushi", "dumpling", "pizza", "burger", "chicken", "meat", "coffee", "salad", "taco", "katsu", "pasta"];

// 위에 있을수록 우선. 카테고리가 여러 개면 가장 위 규칙에 걸린 아이콘을 씁니다.
const ICON_RULES = [
  ["noodle", ["라멘"]],
  ["pasta", ["파스타", "스파게티"]],
  ["meat", ["함박", "경양식"]],
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
  ["noodle", ["일식"]],
];

const iconPath = (name) => `icons/${name}.svg`;

function iconFor(categories) {
  const rule = ICON_RULES.find(([, words]) =>
    categories.some((c) => words.some((w) => c.includes(w))));
  return iconPath(rule ? rule[0] : "rice");
}

// 뽑는 동안 아이콘이 바뀔 때 깜빡이지 않도록 미리 불러 둡니다.
for (const name of ICON_NAMES) new Image().src = iconPath(name);
