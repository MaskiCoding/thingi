const W = 960;
const H = 640;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

const room = document.getElementById("room");
const rig = document.getElementById("rig");
const screen = document.getElementById("screen");
const desktop = document.getElementById("desktop");
const strip = document.getElementById("strip");
const tasks = document.getElementById("tasks");
const tray = document.getElementById("tray");
const led = document.getElementById("led");

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const pick = (list) => list[Math.floor(Math.random() * list.length)];

let termLog = () => {};

const apps = [
  {
    id: "notes", title: "notes.txt", x: 34, y: 30, w: 372, h: 236,
    body: `<pre></pre>`,
    async start(el) {
      const pre = el.querySelector("pre");
      const head = "oriel";
      const text = "\n\nevery window on your mac,\none keystroke away.\n\nhold ⌥ option, tap ⇥ tab,\nlet go to jump.\n\n(go on. this whole machine\nis running it.)";
      const draw = (h, t) => { pre.innerHTML = `<strong>${h}</strong>${t}<span class="cur"></span>`; };
      draw("", "");
      await wait(1300);
      for (let i = 1; i <= head.length; i++) { draw(head.slice(0, i), ""); await wait(reduced ? 0 : 110); }
      for (let i = 1; i <= text.length; i++) { draw(head, text.slice(0, i)); await wait(reduced ? 0 : 28 + Math.random() * 60); }
    },
  },
  {
    id: "term", title: "terminal", x: 440, y: 40, w: 424, h: 262,
    body: `<pre></pre>`,
    async start(el) {
      const pre = el.querySelector("pre");
      const lines = [];
      const push = (line, cls = "") => {
        lines.push(cls ? `<span class="${cls}">${line}</span>` : line);
        while (lines.length > 11) lines.shift();
        pre.innerHTML = lines.join("\n") + `\n<span class="cur"></span>`;
      };
      termLog = (line) => push(line, "hi");
      const script = [
        ["$ git clone https://github.com/MaskiCoding/oriel.git", "hi", 700],
        ["cloning into 'oriel'... done.", "dim", 300],
        ["$ cd oriel && ORIEL_SIGN_ID=- just install", "hi", 800],
        ["   compiling oriel-core", "dim", 260],
        ["   compiling skylight-sys", "dim", 220],
        ["   compiling capture", "dim", 240],
        ["   linking OrielApp.swift", "dim", 420],
        ["installed /Applications/Oriel.app", "", 700],
        ["$ oriel status", "hi", 600],
      ];
      await wait(900);
      for (const [line, cls, ms] of script) { push(line, cls); await wait(ms); }
      const chatter = [
        () => `watching ${document.querySelectorAll(".desktop > .win").length} windows`,
        () => "network calls: 0",
        () => "telemetry: none",
        () => "lens ⌥⇥ ready",
        () => `preview cache warm (${apps.length}/${apps.length})`,
        () => "config reloaded ~/.config/oriel/config.toml",
      ];
      let last = null;
      for (;;) {
        await wait(1800 + Math.random() * 2600);
        const next = pick(chatter.filter((c) => c !== last));
        last = next;
        push(next(), "dim");
      }
    },
  },
  {
    id: "paint", title: "paint — enso.bmp", x: 92, y: 248, w: 330, h: 312,
    body: `<div class="tools"><i class="on" style="background:#3b2a1e"></i><i style="background:#e8742a"></i><i style="background:#3f9c96"></i><i style="background:#7b5cb8"></i><i style="background:#f0c95a"></i></div><canvas width="560" height="560"></canvas>`,
    start(el) {
      const canvas = el.querySelector("canvas");
      const ctx = canvas.getContext("2d");
      const size = canvas.width;
      const steps = 170;
      let step = 0;
      let seed = Math.random() * 10;
      let start = -Math.PI * 0.35;
      let pause = 0;
      ctx.fillStyle = "#fffaf0";
      ctx.fillRect(0, 0, size, size);
      const frame = () => {
        if (pause > 0) {
          pause--;
          if (pause < 30) { ctx.fillStyle = "rgba(255,250,240,0.18)"; ctx.fillRect(0, 0, size, size); }
          if (pause === 0) { step = 0; seed = Math.random() * 10; start = -Math.PI * (0.2 + Math.random() * 0.4); }
        } else {
          for (let n = 0; n < (reduced ? steps : 2); n++) {
            const t = step / steps;
            const a = start + t * Math.PI * 1.82;
            const r = size * 0.3 + Math.sin(t * 7 + seed) * 6 + Math.sin(t * 23 + seed) * 2;
            const x = size / 2 + Math.cos(a) * r;
            const y = size / 2 + 10 + Math.sin(a) * r;
            const width = 40 * Math.pow(1 - t, 0.55) + 4;
            for (let b = 0; b < 7; b++) {
              const off = (b - 3) / 3;
              ctx.fillStyle = `rgba(43, 31, 22, ${0.18 + Math.random() * 0.2})`;
              ctx.beginPath();
              ctx.arc(x + Math.cos(a) * off * width * 0.5, y + Math.sin(a) * off * width * 0.5, width * (0.18 + Math.random() * 0.12), 0, Math.PI * 2);
              ctx.fill();
            }
            step++;
            if (step > steps) { pause = 240; break; }
          }
        }
        requestAnimationFrame(frame);
      };
      setTimeout(frame, 1600);
    },
  },
  {
    id: "config", title: "config.toml", x: 318, y: 162, w: 372, h: 244,
    body: `<pre><span class="c"># ~/.config/oriel/config.toml
# reloads on save. no restart.</span>

[[lens]]
<span class="k">trigger</span> = <span class="s">"cmd+tab"</span>   <span class="c"># every window</span>

[[lens]]
<span class="k">trigger</span> = <span class="s">"alt+tab"</span>   <span class="c"># this app only</span>

[[lens]]
<span class="k">trigger</span> = <span class="s">"ctrl+1"</span>
<span class="k">app</span> = <span class="s">"com.mitchellh.ghostty"</span>

[<span class="k">peek</span>]
<span class="k">enabled</span> = <span class="s">true</span></pre>`,
  },
  {
    id: "tunes", title: "tunes", x: 486, y: 338, w: 276, h: 196,
    body: `<div class="track"><b>alt tab lullaby</b><small>the switchers · side a</small></div><div class="bars">${"<i></i>".repeat(18)}</div><div class="prog"><i></i></div>`,
    start(el) {
      const bars = [...el.querySelectorAll(".bars i")];
      const prog = el.querySelector(".prog i");
      const levels = bars.map(() => 30);
      let p = 0;
      setInterval(() => {
        levels.forEach((v, i) => {
          levels[i] = Math.max(8, Math.min(100, v + (Math.random() - 0.5) * 46));
          bars[i].style.height = `${levels[i]}%`;
        });
        p = (p + 0.25) % 100;
        prog.style.width = `${p}%`;
      }, 120);
    },
  },
  {
    id: "clock", title: "clock", x: 782, y: 318, w: 156, h: 196,
    body: `<svg viewBox="-50 -50 100 100" aria-hidden="true"><circle r="46" fill="none" stroke="#3b2a1e" stroke-width="3"/>${Array.from({ length: 12 }, (_, i) => `<rect x="-1.5" y="-43" width="3" height="${i % 3 ? 5 : 9}" fill="#3b2a1e" transform="rotate(${i * 30})"/>`).join("")}<line class="h" y2="-24" stroke="#3b2a1e" stroke-width="5" stroke-linecap="square"/><line class="m" y2="-36" stroke="#3b2a1e" stroke-width="3" stroke-linecap="square"/><line class="s" y2="-38" stroke="#e8742a" stroke-width="1.5"/><circle r="3.5" fill="#e8742a"/></svg>`,
    start(el) {
      const [h, m, s] = ["h", "m", "s"].map((c) => el.querySelector(`.${c}`));
      const tick = () => {
        const d = new Date();
        s.setAttribute("transform", `rotate(${d.getSeconds() * 6})`);
        m.setAttribute("transform", `rotate(${d.getMinutes() * 6 + d.getSeconds() * 0.1})`);
        h.setAttribute("transform", `rotate(${(d.getHours() % 12) * 30 + d.getMinutes() * 0.5})`);
        tray.textContent = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      };
      tick();
      setInterval(tick, 1000);
    },
  },
];

const byId = Object.fromEntries(apps.map((a) => [a.id, a]));
let order = ["notes", "term", "config", "paint", "tunes", "clock"];
let selected = 0;
let held = false;

for (const app of apps) {
  const el = document.createElement("section");
  el.className = `win ${app.id}`;
  el.style.cssText = `left:${app.x}px;top:${app.y}px;width:${app.w}px;height:${app.h}px`;
  el.innerHTML = `<header class="title"><button class="min" type="button" aria-label="Minimize ${app.title}"></button><b>${app.title}</b></header><div class="body">${app.body}</div>`;
  desktop.insertBefore(el, strip);
  app.el = el;
  app.start?.(el);

  el.addEventListener("pointerdown", () => focus(app.id));
  el.querySelector(".min").addEventListener("click", (e) => { e.stopPropagation(); minimize(app.id); });
  drag(el.querySelector(".title"), app);
}

function scale() {
  return screen.clientWidth / W;
}

function fit() {
  desktop.style.transform = `scale(${scale()})`;
}

function restack() {
  order.forEach((id, i) => {
    byId[id].el.style.zIndex = 100 - i;
    byId[id].el.classList.toggle("active", i === 0 && !byId[id].el.hidden);
  });
  tasks.innerHTML = apps
    .map((a) => `<button type="button" data-id="${a.id}" class="${a.el.hidden ? "off" : ""} ${order[0] === a.id && !a.el.hidden ? "on" : ""}">${a.title}</button>`)
    .join("");
}

function focus(id) {
  byId[id].el.hidden = false;
  order = [id, ...order.filter((x) => x !== id)];
  restack();
}

function minimize(id) {
  byId[id].el.hidden = true;
  order = [...order.filter((x) => x !== id), id];
  restack();
}

function drag(handle, app) {
  handle.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".min")) return;
    handle.setPointerCapture(e.pointerId);
    const s = scale();
    const sx = e.clientX;
    const sy = e.clientY;
    const ox = app.el.offsetLeft;
    const oy = app.el.offsetTop;
    const move = (ev) => {
      const x = Math.max(-app.w + 60, Math.min(W - 60, ox + (ev.clientX - sx) / s));
      const y = Math.max(0, Math.min(H - 70, oy + (ev.clientY - sy) / s));
      app.el.style.left = `${x}px`;
      app.el.style.top = `${y}px`;
    };
    const up = () => { handle.removeEventListener("pointermove", move); handle.removeEventListener("pointerup", up); };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
  });
}

function thumb(app) {
  const clone = app.el.cloneNode(true);
  clone.hidden = false;
  clone.classList.remove("active");
  const canvas = app.el.querySelector("canvas");
  if (canvas) {
    const img = new Image();
    img.src = canvas.toDataURL();
    img.style.cssText = "flex:1;min-width:0;width:100%;height:100%;object-fit:cover;background:#fffaf0";
    clone.querySelector("canvas").replaceWith(img);
  }
  const k = Math.min(112 / app.w, 78 / app.h);
  const box = document.createElement("div");
  box.style.cssText = `width:${app.w}px;height:${app.h}px;transform:translate(${(112 - app.w * k) / 2}px, ${(78 - app.h * k) / 2}px) scale(${k})`;
  box.append(clone);
  return box;
}

const isOpen = () => !strip.hidden;

function openStrip(viaKeys) {
  held = viaKeys;
  selected = order.length > 1 ? 1 : 0;
  strip.replaceChildren(
    ...order.map((id, i) => {
      const app = byId[id];
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = `tile${app.el.hidden ? " min" : ""}`;
      tile.setAttribute("role", "option");
      tile.setAttribute("aria-selected", i === selected);
      tile.dataset.i = i;
      const t = document.createElement("div");
      t.className = "thumb";
      t.append(thumb(app));
      tile.append(t);
      tile.insertAdjacentHTML("beforeend", `<span>${app.title}</span><b>${i + 1}</b>`);
      return tile;
    }),
  );
  strip.hidden = false;
}

function select(i) {
  selected = (i + order.length) % order.length;
  strip.querySelectorAll(".tile").forEach((t, n) => t.setAttribute("aria-selected", n === selected));
}

function closeStrip() {
  held = false;
  strip.hidden = true;
}

function jump(i) {
  const id = order[i];
  closeStrip();
  focus(id);
  termLog(`jump → ${byId[id].title}`);
}

function minimizeSelected() {
  const id = order[selected];
  minimize(id);
  termLog(`minimized ${byId[id].title}`);
  openStrip(held);
}

function blink() {
  led.classList.add("blink");
  clearTimeout(blink.t);
  blink.t = setTimeout(() => led.classList.remove("blink"), 70);
}

document.addEventListener("keydown", (e) => {
  blink();
  if (e.key === "Tab" && e.altKey) {
    e.preventDefault();
    if (!isOpen()) openStrip(true);
    else select(selected + (e.shiftKey ? -1 : 1));
    return;
  }
  if (!isOpen()) return;
  const digit = e.code.startsWith("Digit") ? Number(e.code.slice(5)) : 0;
  if (digit >= 1 && digit <= order.length) { e.preventDefault(); jump(digit - 1); }
  else if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); select(selected + 1); }
  else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); select(selected - 1); }
  else if (e.key === "Enter") { e.preventDefault(); jump(selected); }
  else if (e.key === "Escape") closeStrip();
  else if (e.code === "KeyW" || e.code === "KeyM") { e.preventDefault(); minimizeSelected(); }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "Alt" && held && isOpen()) jump(selected);
});

addEventListener("blur", () => { if (held && isOpen()) closeStrip(); });

strip.addEventListener("click", (e) => {
  const tile = e.target.closest(".tile");
  if (tile) jump(Number(tile.dataset.i));
});

tasks.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const id = b.dataset.id;
  if (order[0] === id && !byId[id].el.hidden) minimize(id);
  else focus(id);
});

document.getElementById("start").addEventListener("click", () => (isOpen() ? closeStrip() : openStrip(false)));

desktop.addEventListener("pointerdown", (e) => {
  if (isOpen() && !strip.contains(e.target) && !e.target.closest(".start")) closeStrip();
});

if (!reduced) {
  room.addEventListener("pointermove", (e) => {
    const x = e.clientX / innerWidth - 0.5;
    const y = e.clientY / innerHeight - 0.5;
    rig.style.setProperty("--ry", `${x * 5}deg`);
    rig.style.setProperty("--rx", `${2 - y * 4}deg`);
  });
}

new ResizeObserver(fit).observe(screen);
fit();
restack();
