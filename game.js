const TOTAL_QUESTIONS = 10;
const FEATURED_COUNTRY_CODES = [
  "kr","jp","cn","kp","mn","lb","in","pk","bd","np","lk","th","vn","ph","id","my","sg","kh","mm","kz","uz","af","ir","iq","il","sa","ae","qa","jo","tr",
  "gb","fr","de","it","es","pt","nl","be","ch","at","ie","dk","no","se","fi","is","pl","cz","sk","hu","ro","bg","gr","hr","rs","ua","ru","by","va","si",
  "us","ca","mx","br","ar","cl","pe","co","ve","uy","py","ec","bo","cu","jm","do","cr","pa","gt","ht",
  "eg","ma","dz","tn","ly","za","ng","gh","ke","et","tz","ug","sd","cm","mg",
  "au","nz","fj","pg","ws"
];
const EXTRA_FAMILIAR_CODES = new Set(["kr","jp","cn","us","ca","gb","fr","de","it","es","br","au","in","th","vn"]);
const letters = ["A", "B", "C", "D"];
const capitalKo = {
  kr:"서울",jp:"도쿄",cn:"베이징",mn:"울란바토르",kp:"평양",tw:"타이베이",us:"워싱턴 D.C.",ca:"오타와",mx:"멕시코시티",
  br:"브라질리아",ar:"부에노스아이레스",cl:"산티아고",pe:"리마",co:"보고타",ve:"카라카스",uy:"몬테비데오",py:"아순시온",
  bo:"수크레",ec:"키토",gb:"런던",fr:"파리",de:"베를린",it:"로마",es:"마드리드",pt:"리스본",nl:"암스테르담",
  be:"브뤼셀",ch:"베른",at:"빈",ie:"더블린",dk:"코펜하겐",no:"오슬로",se:"스톡홀름",fi:"헬싱키",is:"레이캬비크",
  pl:"바르샤바",cz:"프라하",sk:"브라티슬라바",hu:"부다페스트",ro:"부쿠레슈티",bg:"소피아",gr:"아테네",hr:"자그레브",
  si:"류블랴나",rs:"베오그라드",ba:"사라예보",al:"티라나",mk:"스코페",me:"포드고리차",ua:"키이우",by:"민스크",
  lt:"빌뉴스",lv:"리가",ee:"탈린",md:"키시너우",ru:"모스크바",tr:"앙카라",ge:"트빌리시",am:"예레반",az:"바쿠",
  in:"뉴델리",pk:"이슬라마바드",bd:"다카",np:"카트만두",bt:"팀푸",lk:"스리자야와르데네푸라코테",mv:"말레",
  th:"방콕",vn:"하노이",la:"비엔티안",kh:"프놈펜",mm:"네피도",my:"쿠알라룸푸르",sg:"싱가포르",id:"자카르타",
  ph:"마닐라",bn:"반다르스리브가완",tl:"딜리",au:"캔버라",nz:"웰링턴",pg:"포트모르즈비",fj:"수바",
  sa:"리야드",ae:"아부다비",qa:"도하",kw:"쿠웨이트시티",bh:"마나마",om:"무스카트",ye:"사나",jo:"암만",lb:"베이루트",
  sy:"다마스쿠스",iq:"바그다드",ir:"테헤란",il:"예루살렘",ps:"라말라",kz:"아스타나",uz:"타슈켄트",tm:"아시가바트",
  kg:"비슈케크",tj:"두샨베",af:"카불",eg:"카이로",ly:"트리폴리",tn:"튀니스",dz:"알제",ma:"라바트",sd:"하르툼",
  et:"아디스아바바",ke:"나이로비",tz:"도도마",ug:"캄팔라",rw:"키갈리",bi:"기테가",so:"모가디슈",za:"프리토리아 · 케이프타운 · 블룸폰테인",
  na:"빈트후크",bw:"가보로네",zw:"하라레",zm:"루사카",mz:"마푸투",ao:"루안다",cd:"킨샤사",cg:"브라자빌",ng:"아부자",
  gh:"아크라",ci:"야무수크로",sn:"다카르",ml:"바마코",ne:"니아메",cm:"야운데",mg:"안타나나리보",mu:"포트루이스",
  cu:"아바나",jm:"킹스턴",ht:"포르토프랭스",do:"산토도밍고",cr:"산호세",pa:"파나마시티",gt:"과테말라시티",
  hn:"테구시갈파",sv:"산살바도르",ni:"마나과",bz:"벨모판",va:"바티칸 시국"
};

let quiz = [];
let index = 0;
let score = 0;
let answered = false;
let soundOn = true;
const $ = (id) => document.getElementById(id);
const intro = $("intro");
const game = $("game");
const result = $("result");

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function playSound(kind) {
  if (!soundOn) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const now = context.currentTime;
    const melodies = {
      correct: [
        { frequency: 659.25, start: 0, duration: .18, volume: .15 },
        { frequency: 523.25, start: .18, duration: .20, volume: .15 },
        { frequency: 783.99, start: .39, duration: .42, volume: .19 }
      ],
      wrong: [
        { frequency: 329.63, start: 0, duration: .17, volume: .10 },
        { frequency: 261.63, start: .16, duration: .27, volume: .10 }
      ],
      next: [
        { frequency: 523.25, start: 0, duration: .12, volume: .11 },
        { frequency: 659.25, start: .10, duration: .13, volume: .12 },
        { frequency: 783.99, start: .21, duration: .22, volume: .14 }
      ]
    };
    const notes = melodies[kind] || melodies.next;
    notes.forEach((note) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = now + note.start;
      const end = start + note.duration;
      oscillator.type = kind === "wrong" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(note.frequency, start);
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(note.volume, start + .018);
      gain.gain.exponentialRampToValueAtTime(.0001, end);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(end + .02);
    });
    const finish = Math.max(...notes.map((note) => note.start + note.duration)) + .12;
    window.setTimeout(() => context.close(), finish * 1000);
  } catch (error) {
    console.warn("효과음을 재생할 수 없습니다.", error);
  }
}

function showScreen(name) {
  intro.hidden = name !== "intro"; game.hidden = name !== "game"; result.hidden = name !== "result";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function makeQuiz() {
  const featured = window.COUNTRIES.filter((country) => FEATURED_COUNTRY_CODES.includes(country.code));
  const weighted = featured.map((country) => ({ country, key: Math.pow(Math.random(), 1 / (EXTRA_FAMILIAR_CODES.has(country.code) ? 2.2 : 1)) }));
  const selected = weighted.sort((a, b) => b.key - a.key).slice(0, TOTAL_QUESTIONS).map((item) => item.country);
  quiz = selected.map((country) => {
    const regional = featured.filter((item) => item.code !== country.code && item.region === country.region);
    const others = featured.filter((item) => item.code !== country.code && item.region !== country.region);
    const distractors = shuffle([...shuffle(regional).slice(0, 2), ...shuffle(others)]).slice(0, 3);
    return { ...country, options: shuffle([country, ...distractors]) };
  });
}

function flagPath(code) { return `assets/flags/${code}.png`; }
function capitalName(country) { return capitalKo[country.code] || country.capital; }
function regionName(region) { return { Africa:"아프리카", Americas:"아메리카", Asia:"아시아", Europe:"유럽", Oceania:"오세아니아", Antarctic:"남극" }[region] || "세계"; }

function renderQuestion() {
  const country = quiz[index]; answered = false;
  $("quiz-view").hidden = false;
  $("question-number").textContent = index + 1; $("score").textContent = score;
  $("progress-bar").style.width = `${((index + 1) / TOTAL_QUESTIONS) * 100}%`;
  $("progress-track").setAttribute("aria-valuenow", index + 1);
  $("flag").src = flagPath(country.code); $("flag").alt = `${index + 1}번 문제 국기`;
  $("feedback").hidden = true; $("feedback").className = "feedback-card game-view";
  const box = $("answers"); box.replaceChildren();
  country.options.forEach((option, i) => {
    const button = document.createElement("button"); button.type = "button"; button.className = "answer"; button.dataset.code = option.code;
    const letter = document.createElement("span"); letter.className = "letter"; letter.textContent = letters[i];
    const label = document.createElement("strong"); label.textContent = option.name;
    const mark = document.createElement("span"); mark.className = "mark";
    button.append(letter, label, mark);
    button.addEventListener("click", () => chooseAnswer(option.code));
    box.append(button);
  });
}

function chooseAnswer(code) {
  if (answered) return; answered = true;
  const country = quiz[index]; const correct = code === country.code;
  if (correct) { score++; $("score").textContent = score; }
  [...$("answers").children].forEach((button) => {
    button.disabled = true;
    if (button.dataset.code === country.code) { button.classList.add("correct"); button.querySelector(".mark").textContent = "✓"; }
    else if (button.dataset.code === code) { button.classList.add("wrong"); button.querySelector(".mark").textContent = "×"; }
    else button.classList.add("muted");
  });
  const feedback = $("feedback"); feedback.className = `feedback-card game-view ${correct ? "correct" : "wrong"}`;
  $("feedback-emoji").textContent = correct ? "🎉" : "💡";
  $("feedback-message").textContent = correct ? "딩동댕! 정답이야!" : "괜찮아, 이번에 기억하면 돼!";
  $("country-name").textContent = country.name; $("capital").textContent = capitalName(country);
  $("answer-flag").src = flagPath(country.code);
  $("answer-flag").alt = `${country.name} 국기`;
  $("fact").textContent = `위치: ${regionName(country.region)}, 수도: ${capitalName(country)}`;
  $("pin-label").textContent = country.name;
  const x = Math.max(3, Math.min(97, ((country.lng + 180) / 360) * 100));
  const y = Math.max(6, Math.min(96, ((90 - country.lat) / 180) * 100));
  $("pin").style.left = `${x}%`; $("pin").style.top = `${y}%`;
  $("map").setAttribute("aria-label", `세계지도에서 ${country.name}의 위치`);
  $("next-button").querySelector("span").textContent = index === TOTAL_QUESTIONS - 1 ? "결과 보기" : "다음 문제";
  $("quiz-view").hidden = true;
  feedback.hidden = false;
  feedback.focus({ preventScroll: true });
  playSound(correct ? "correct" : "wrong");
}

function startGame() { index = 0; score = 0; makeQuiz(); renderQuestion(); showScreen("game"); playSound("next"); }
function showResult() {
  const message = score === 10 ? "완벽한 국기 박사!" : score >= 7 ? "대단한 세계 탐험가!" : score >= 4 ? "멋지게 탐험했어!" : "다음 여행은 더 잘할 거야!";
  $("result-message").textContent = message; $("final-score").textContent = score;
  $("result-copy").textContent = `유명한 100개 나라 중 새로운 국기로 다시 도전할 수 있어!`; showScreen("result");
}

document.querySelectorAll(".sound-toggle").forEach((button) => button.addEventListener("click", () => {
  soundOn = !soundOn; document.querySelectorAll(".sound-toggle").forEach((item) => { item.textContent = soundOn ? "🔊" : "🔇"; item.setAttribute("aria-label", soundOn ? "소리 끄기" : "소리 켜기"); });
}));
$("start-button").addEventListener("click", startGame); $("restart-button").addEventListener("click", startGame);
$("next-button").addEventListener("click", () => { playSound("next"); if (index === TOTAL_QUESTIONS - 1) showResult(); else { index++; renderQuestion(); window.scrollTo({ top: 0, behavior: "smooth" }); } });
