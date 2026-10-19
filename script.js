const QUESTIONS = [
  { text:"What does the 'M' in STEM stand for?", options:['Medicine','Management','Mathematics','Mechanics'], answer:2, difficulty:'EASY', hint:'Think of numbers, patterns and equations.', friend:'I am confident it is C. Mathematics.' },
  { text:'Which famous female executive was the CEO of PepsiCo?', options:['Indra Nooyi','Sheryl Sandberg','Susan Wojcicki','Mary Barra'], answer:0, difficulty:'EASY', hint:'Her surname begins with N.', friend:'That was Indra Nooyi. I would choose A.' },
  { text:'Which Australian woman co-founded the graphic design platform Canva?', options:['Jane Lu','Melanie Perkins','Kayla Itsines','Naomi Simson'], answer:1, difficulty:'MEDIUM · AUSTRALIAN', hint:'Her first name is Melanie.', friend:'I use Canva! Its co-founder is Melanie Perkins, option B.' },
  { text:'Who was the first woman to win a Nobel Prize?', options:['Ada Lovelace','Rosalind Franklin','Marie Curie','Jane Goodall'], answer:2, difficulty:'EASY', hint:'She won for physics in 1903 and later for chemistry.', friend:'Marie Curie, C. I am sure about this one.' },
  { text:'Which famous female business leader served as the CEO of YouTube?', options:['Lisa Su','Susan Wojcicki','Whitney Wolfe Herd','Safra Catz'], answer:1, difficulty:'EASY', hint:'Her surname starts with W.', friend:'Susan Wojcicki was YouTube CEO. Go with B.' },
  { text:'Which female scientist is famous for her work on the structure of DNA?', options:['Rosalind Franklin','Grace Hopper','Rachel Carson','Barbara McClintock'], answer:0, difficulty:'MEDIUM', hint:'Her X-ray diffraction image is known as Photo 51.', friend:'I think it is Rosalind Franklin, A.' },
  { text:"Which woman helped NASA calculate trajectories for historic space missions, including John Glenn's orbital flight?", options:['Margaret Hamilton','Sally Ride','Katherine Johnson','Mae Jemison'], answer:2, difficulty:'MEDIUM', hint:'She was featured in Hidden Figures.', friend:'Katherine Johnson, option C, calculated those trajectories.' },
  { text:"Which Australian medical pioneer co-developed the revolutionary 'spray-on skin' treatment for burns?", options:['Elizabeth Blackburn','Fiona Wood','Fiona Stanley','Michelle Simmons'], answer:1, difficulty:'MEDIUM · AUSTRALIAN', hint:'Her first name is Fiona; her surname is also a natural material.', friend:'That is burns surgeon Fiona Wood. B.' },
  { text:'Which female technology leader is known for leading AMD as CEO?', options:['Lisa Su','Sheryl Sandberg','Marissa Mayer','Susan Wojcicki'], answer:0, difficulty:'MEDIUM', hint:'Her name has just six letters, including the space.', friend:'I follow chip companies. Lisa Su is AMD CEO, A.' },
  { text:'Which Australian-born scientist won the 2009 Nobel Prize in Medicine for research involving telomeres, which protect chromosomes?', options:['Fiona Stanley','Michelle Simmons','Elizabeth Blackburn','Dorothy Hill'], answer:2, difficulty:'MEDIUM · AUSTRALIAN', hint:'Her surname sounds like a dark colour followed by a small stream.', friend:'That Nobel winner is Elizabeth Blackburn. Choose C.' }
];
const GAME_KEY = 'stemMillionaire.game.v2';
const BOARD_KEY = 'stemMillionaire.board.v3';
const app = document.getElementById('app');
let game = read(GAME_KEY, null);

function read(key, fallback) {
  try { return JSON.parse(sessionStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function save() { sessionStorage.setItem(GAME_KEY, JSON.stringify(game)); }
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function stickers(count) { return `${count} ${count === 1 ? 'sticker' : 'stickers'}`; }
function milestone(index) { return index === 4 ? 1 : index === 9 ? 2 : 0; }
function render() {
  if (!game || game.status === 'home') return renderHome();
  if (game.status === 'playing') return renderGame();
  renderResult();
}
function renderHome() {
  app.innerHTML = `<section class="landing"><span class="pill">✦ &nbsp; THE WOMEN IN STEM EDITION</span><h1>STEM <span class="gradient-text">Millionaire</span></h1><p class="lead">Ten questions. Four lifelines. One brilliant journey through the women who changed science, technology and business.</p><form id="startForm" class="landing-form"><label class="input-label" for="playerName">YOUR NAME</label><input id="playerName" class="name-input" type="text" maxlength="24" required autocomplete="name" placeholder="Enter your name"><button class="primary-button" type="submit">Start Game &nbsp; ✦</button></form><div class="feature-row"><span><b>◆</b> 10 questions</span><span><b>◈</b> 4 lifelines</span><span><b>✦</b> Stickers at 5 &amp; 10</span></div></section>`;
  document.getElementById('startForm').addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('playerName').value.trim();
    if (!name) return;
    game = {name, index:0, status:'playing', used:{fifty:false,hint:false,phone:false,stop:false}, hidden:[], message:'', selected:null, stickers:0, recorded:false};
    save(); render();
  });
}
function renderGame() {
  const q = QUESTIONS[game.index], n = game.index + 1;
  const award = milestone(game.index);
  app.innerHTML = `<div class="game"><section class="game-main"><div class="game-top"><span class="level-tag">QUESTION ${String(n).padStart(2,'0')} / 10</span><span class="sticker-count">✦ ${stickers(game.stickers)}</span></div><div class="progress"><div style="width:${n * 10}%"></div></div><div class="question-card"><div class="question-meta"><span class="question-number">${award ? `MILESTONE · ${stickers(award).toUpperCase()}` : 'WOMEN IN STEM'}</span><span class="difficulty">${q.difficulty}</span></div><h1>${escapeHTML(q.text)}</h1><div class="answers">${q.options.map((option,i) => `<button class="answer ${game.hidden.includes(i) ? 'hidden-answer' : ''} ${game.selected === null ? '' : i === q.answer ? 'correct' : i === game.selected ? 'wrong' : ''}" data-answer="${i}" type="button" ${game.selected !== null || game.hidden.includes(i) ? 'disabled' : ''}><span class="answer-letter">${'ABCD'[i]}</span><span>${escapeHTML(option)}</span></button>`).join('')}</div>${game.message ? `<div class="feedback" role="status">${escapeHTML(game.message)}</div>` : ''}${game.selected === q.answer ? `<button class="primary-button next-button" id="nextButton" type="button">${n === 10 ? 'See your result' : 'Next question'} &nbsp; →</button>` : ''}</div></section><aside class="side-card"><h2 class="side-title">Your lifelines</h2><div class="lifelines">${[['fifty','½','50:50'],['hint','✧','Hint'],['phone','☎','Phone a friend'],['stop','◷','Stop timer']].map(([key,icon,label]) => `<button class="lifeline" data-life="${key}" type="button" ${game.used[key] || game.selected !== null ? 'disabled' : ''} title="${label}${game.used[key] ? ' (used)' : ''}"><span class="lifeline-icon">${icon}</span>${label}</button>`).join('')}</div><div class="side-divider"></div><h2 class="side-title">Sticker milestones</h2><div class="ladder">${QUESTIONS.map((_,i) => `<div class="ladder-row ${i === game.index ? 'current' : ''} ${i < game.index ? 'passed' : ''} ${milestone(i) ? 'checkpoint' : ''}"><span>${String(i + 1).padStart(2,'0')} ${milestone(i) ? '◆' : ''}</span><span>${milestone(i) ? stickers(milestone(i)) : '—'}</span></div>`).join('')}</div><p class="status-note">Answer question 5 for 1 sticker, then question 10 for 2 stickers total. Your host handles timing.</p></aside></div>`;
  document.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => choose(Number(button.dataset.answer))));
  document.querySelectorAll('[data-life]').forEach(button => button.addEventListener('click', () => lifeline(button.dataset.life)));
  document.getElementById('nextButton')?.addEventListener('click', next);
}
function choose(index) {
  if (game.selected !== null || game.hidden.includes(index)) return;
  game.selected = index;
  const q = QUESTIONS[game.index];
  if (index === q.answer) {
    const award = milestone(game.index);
    if (award) game.stickers = award;
    game.message = `Correct! ${q.options[index]} is the answer.${award ? ` You earned ${stickers(award)}!` : ''}`;
    save(); renderGame();
  } else {
    finish(false);
  }
}
function lifeline(type) {
  if (game.used[type] || game.selected !== null) return;
  const q = QUESTIONS[game.index];
  game.used[type] = true;
  if (type === 'fifty') {
    game.hidden = q.options.map((_,i) => i).filter(i => i !== q.answer).slice(0,2);
    game.message = '50:50 removed two incorrect answers.';
  }
  if (type === 'hint') game.message = `Hint: ${q.hint}`;
  if (type === 'phone') game.message = `Your friend says: “${q.friend}”`;
  if (type === 'stop') game.message = 'Stop timer used — ask the host to pause manual timing for this question.';
  save(); renderGame();
}
function next() {
  if (game.selected !== QUESTIONS[game.index].answer) return;
  if (game.index === 9) return finish(true);
  game.index++;
  game.selected = null;
  game.hidden = [];
  game.message = '';
  save(); renderGame();
}
function finish(won) {
  game.status = won ? 'won' : 'lost';
  game.finalScore = game.stickers;
  if (!game.recorded) {
    const board = read(BOARD_KEY, []);
    board.push({name:game.name, score:game.finalScore, questions:won ? 10 : game.index, date:new Date().toISOString()});
    board.sort((a,b) => b.score - a.score || b.questions - a.questions || a.date.localeCompare(b.date));
    sessionStorage.setItem(BOARD_KEY, JSON.stringify(board.slice(0,20)));
    game.recorded = true;
  }
  save(); renderResult();
}
function renderResult() {
  const won = game.status === 'won';
  app.innerHTML = `<section class="result-wrap"><div class="result-card"><div class="result-icon">${won ? '🏆' : '✦'}</div><span class="eyebrow">${won ? 'STEM CHAMPION' : 'GAME COMPLETE'}</span><h1>${won ? 'Brilliant work!' : 'Great effort!'}</h1><p>${won ? `You answered all 10 questions, ${escapeHTML(game.name)}. Your STEM knowledge shines!` : `${escapeHTML(game.name)}, you reached question ${game.index + 1}.${game.stickers ? ' You keep the sticker you earned at question 5.' : ' Keep going to earn your first sticker at question 5!'}`}</p><div class="score-box"><small>YOUR STICKER SCORE</small><strong>${stickers(game.finalScore)}</strong></div><div class="result-actions"><button id="playAgain" class="primary-button" type="button">Play again ↗</button><button id="viewBoard" class="secondary-button" type="button">View leaderboard</button></div></div></section>`;
  document.getElementById('playAgain').addEventListener('click', () => {game = {status:'home'}; save(); renderHome();});
  document.getElementById('viewBoard').addEventListener('click', openBoard);
}
function openBoard() {
  const board = read(BOARD_KEY, []);
  document.getElementById('leaderboardContent').innerHTML = board.length ? board.map((row,i) => `<div class="leader-row"><span class="leader-rank">${i + 1}.</span><span class="leader-name">${escapeHTML(row.name)}</span><span class="leader-score">${stickers(row.score)}</span></div>`).join('') : '<p class="empty-board">No scores yet. Start a game to claim the first spot!</p>';
  document.getElementById('leaderboardDialog').showModal();
}
document.getElementById('leaderboardToggle').addEventListener('click', openBoard);
document.getElementById('closeLeaderboard').addEventListener('click', () => document.getElementById('leaderboardDialog').close());
render();
