let cachedHour = null;
let cachedPhrase = '';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/code/diel/service-worker.js');
}

const palette = [
  // 0–5: Night
  { center: '#0d1117', edge: '#07090d', ringStart: '#1a1f26', ringEnd: '#252a31' }, // 0
  { center: '#0f131a', edge: '#080a0f', ringStart: '#1c2129', ringEnd: '#2a2f37' },
  { center: '#11161d', edge: '#090c11', ringStart: '#1f242d', ringEnd: '#2d323b' },
  { center: '#14191f', edge: '#0a0e13', ringStart: '#22272f', ringEnd: '#30353f' },
  { center: '#161b21', edge: '#0c1015', ringStart: '#242a32', ringEnd: '#343843' },
  { center: '#191e24', edge: '#0e1117', ringStart: '#272e36', ringEnd: '#373c47' },

  // 6–11: Dawn
  { center: '#1f2328', edge: '#12151a', ringStart: '#2d333b', ringEnd: '#3d434d' },
  { center: '#252a2f', edge: '#16191e', ringStart: '#333942', ringEnd: '#434955' },
  { center: '#2b3135', edge: '#1a1e23', ringStart: '#3a4049', ringEnd: '#4a505c' },
  { center: '#31363b', edge: '#1e2227', ringStart: '#404651', ringEnd: '#505663' },
  { center: '#383c42', edge: '#22262b', ringStart: '#474d58', ringEnd: '#575c6a' },
  { center: '#3f4249', edge: '#262a2f', ringStart: '#4f545f', ringEnd: '#5e6371' },

  // 12–17: Daylight and Golden Hour
  { center: '#484a4f', edge: '#2b2f33', ringStart: '#585b61', ringEnd: '#6c6f77' }, // Noon – brightest neutral
  { center: '#4f4945', edge: '#2f2b27', ringStart: '#5e5854', ringEnd: '#776b63' },
  { center: '#56453d', edge: '#332720', ringStart: '#645348', ringEnd: '#7e6757' },
  { center: '#5a4037', edge: '#36251d', ringStart: '#6a4e42', ringEnd: '#856351' },
  { center: '#4f3831', edge: '#2d1e18', ringStart: '#5f443b', ringEnd: '#724e43' },
  { center: '#45312a', edge: '#251813', ringStart: '#553d34', ringEnd: '#62453c' },

  // 18–23: Twilight to Deep Night
  { center: '#3d2a26', edge: '#1f1411', ringStart: '#4a3731', ringEnd: '#573f3a' },
  { center: '#352422', edge: '#1a110f', ringStart: '#41312d', ringEnd: '#4d3935' },
  { center: '#2f1e1c', edge: '#16100e', ringStart: '#382c29', ringEnd: '#443430' },
  { center: '#281918', edge: '#120d0d', ringStart: '#302625', ringEnd: '#3b2e2c' },
  { center: '#211415', edge: '#0e0a0b', ringStart: '#291f21', ringEnd: '#322728' },
  { center: '#1b1012', edge: '#0b080a', ringStart: '#231a1d', ringEnd: '#2a2225' },
  { center: '#161015', edge: '#09070a', ringStart: '#1e181d', ringEnd: '#242028' },
  { center: '#0d1117', edge: '#07090d', ringStart: '#1a1f26', ringEnd: '#252a31' }, // 23 wrap
];

const phrases = {
  0: ["the hush between stars", "midnight unfolds inward", "sleep hides in shadow"],
  1: ["breath of the unseen", "stillness hums here", "the edge of forgetting"],
  2: ["what silence remembers", "nothing stirs above", "closed light"],
  3: ["a shadow folded inward", "wind without direction", "echoes with no name"],
  4: ["light waits behind thought", "anticipation is breathless", "softness below form"],
  5: ["the sky begins its whisper", "horizon exhales", "a slow approach"],
  6: ["dawn leans into the world", "edges become visible", "light touches silence"],
  7: ["a breath before momentum", "morning leans in quietly", "shapes are promised"],
  8: ["stillness has weight", "day begins to speak", "shadows return"],
  9: ["the hour holds itself", "time stretches awake", "steps echo lightly"],
  10: ["clarity opens slowly", "motion without effort", "sun on skin"],
  11: ["what moves without sound", "held by the horizon", "noon ripens"],
  12: ["the sun is not watching", "center without centre", "pause inside breath"],
  13: ["presence without proof", "form behind function", "weightless time"],
  14: ["time gathers in corners", "light slips forward", "distance fades"],
  15: ["light forgets to speak", "a gesture dissolves", "tension thins"],
  16: ["shadows begin to lengthen", "things begin returning", "dust traces form"],
  17: ["dust listens closely", "evening waits at the door", "thought becomes grain"],
  18: ["evening exhales the day", "what fades stays warm", "edges loosen"],
  19: ["memory cools in amber", "light is in retreat", "closing happens slowly"],
  20: ["echo follows form", "everything moves inward", "time curves again"],
  21: ["the dark does not ask", "formlessness returns", "questions sleep"],
  22: ["what was never named", "unfinished light", "not yet gone"],
  23: ["folded into the dusk", "nearing stillness", "held and vanished"]
};

function updateVisuals() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const angle = (hour + minute / 60) * 15; // 15° per hour

  // Set up ring transform *in addition* to the center translation
  const ring = document.getElementById('ring');
  ring.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

  // Update background and ring colours
  const { center, edge, ringStart, ringEnd } = palette[hour];
  document.documentElement.style.setProperty('--center-color', center);
  document.documentElement.style.setProperty('--edge-color', edge);
  document.documentElement.style.setProperty('--ring-start', ringStart);
  document.documentElement.style.setProperty('--ring-end', ringEnd);
}

function showPhrase() {
  const now = new Date();
  const hour = now.getHours();

  // If hour has changed, pick a new phrase
  if (hour !== cachedHour) {
    const options = phrases[hour];
    cachedPhrase = options[Math.floor(Math.random() * options.length)];
    cachedHour = hour;
  }

  const phraseEl = document.getElementById('phrase');
  phraseEl.textContent = cachedPhrase;
  phraseEl.style.opacity = 1;

  setTimeout(() => {
    phraseEl.style.opacity = 0;
  }, 8000);
}

// Initialise immediately
updateVisuals();

// Refresh visuals every minute
setInterval(updateVisuals, 60000);

// Show phrase on interaction only
document.body.addEventListener('click', showPhrase);
document.body.addEventListener('touchstart', showPhrase);
