// Live vignettes: small working pieces of the product, drawn in HTML and SVG with the real
// data from the Fernway test day. Every one pauses off screen and shows its end state when the
// visitor prefers reduced motion. React mounts one per <Alive> through mountAlive(), and the
// returned cleanup stops its timers when the page changes. The words, numbers and timings each
// vignette replays come in as data from content/vignettes.json (shapes in vignettes.types.ts);
// what stays here is layout: SVG geometry, node positions, colours and the animation's pacing.

import { iconSvg } from './icons.js'

let calm = false
/** Thrown by a stage's timers once its vignette is unmounted, to unwind the running loop */
const ABORT = Symbol('unmounted')
const $ = (s, r) => r.querySelector(s)
const $$ = (s, r) => [...r.querySelectorAll(s)]
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;')
/** esc() for a value inside a double-quoted attribute */
const attr = (t) => esc(t).replace(/"/g, '&quot;')
/** Escaped text with its **highlighted** parts wrapped in <mark> */
const marked = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, '<mark>$1</mark>')
const AGENT = { desk: '#3987e5', orders: '#e0703f', tech: '#14a8a8', billing: '#d6589a', research: '#7d6bea', review: '#eef0f5' }
const tile = (a) => `<i class="al-sq" style="background:${AGENT[a]}"></i>`
const registry = {}
const define = (name, fn) => (registry[name] = fn)

/** Timing for one vignette: sleep() stops counting while it is off screen */
function stageOf(el, signal) {
  let on = false
  let wake = null
  let ring = null
  let timer = 0
  const io = new IntersectionObserver(([e]) => {
    on = e.isIntersecting
    if (on && wake) { wake(); wake = null }
  }, { threshold: 0.12 })
  io.observe(el)
  signal.addEventListener('abort', () => {
    io.disconnect()
    clearTimeout(timer)
    ring?.()
    wake?.()
  }, { once: true })
  const check = () => { if (signal.aborted) throw ABORT }
  const seen = () => (on ? Promise.resolve() : new Promise((r) => (wake = r)))
  const sleep = async (ms) => {
    check()
    if (calm) return
    await new Promise((r) => { ring = r; timer = setTimeout(r, ms) })
    check()
    await seen()
    check()
  }
  const type = async (node, text, cps = 38) => {
    if (calm) { node.textContent = text; return }
    for (let i = 1; i <= text.length; i++) {
      node.textContent = text.slice(0, i)
      await sleep(1000 / cps)
    }
  }
  return { signal, sleep, type, seen, loop: async (fn) => { do { check(); await seen(); check(); await fn() } while (!calm) } }
}

const along = (path, dot, ms, signal) => new Promise((done) => {
  const L = path.getTotalLength()
  const t0 = performance.now()
  const tick = (t) => {
    if (signal.aborted) return done()
    const k = calm ? 1 : Math.min(1, (t - t0) / ms)
    const p = path.getPointAtLength(L * k)
    dot.setAttribute('cx', p.x)
    dot.setAttribute('cy', p.y)
    if (k < 1) requestAnimationFrame(tick)
    else done()
  }
  requestAnimationFrame(tick)
})

// ------------------------------------------------------- the hero: a live desk, three calls
define('desk', async (el, s, data) => {
  el.innerHTML = `
    <svg class="al-desk__cords" viewBox="0 0 600 620" aria-hidden="true">
      <path class="al-trace" data-c="a" pathLength="1" d="M300 130 C 420 150, 470 170, 470 232"/>
      <path class="al-trace" data-c="b" pathLength="1" d="M300 430 C 300 470, 210 470, 200 498"/>
    </svg>
    <article class="al-card al-desk__in"><header><span class="al-lamp is-live"></span><b data-name></b><small data-chan></small></header><p data-said></p></article>
    <article class="al-card al-desk__work"><header>${tile('orders')}<b data-agent></b><small data-time></small></header><ul data-steps></ul></article>
    <article class="al-card al-desk__out"><header data-outhead></header><p data-reply></p></article>`
  const SCENES = data.scenes
  let n = 0
  const q = (x) => $(x, el)
  await s.loop(async () => {
    const c = SCENES[n++ % SCENES.length]
    el.classList.remove('show-work', 'show-out')
    $$('.al-trace', el).forEach((p) => p.classList.remove('is-on'))
    q('[data-steps]').innerHTML = ''
    q('[data-said]').textContent = ''
    q('[data-reply]').textContent = ''
    q('[data-name]').textContent = c.name
    q('[data-chan]').textContent = c.channel
    await s.sleep(500)
    await s.type(q('[data-said]'), c.said, 44)
    await s.sleep(250)
    q('[data-c=a]').classList.add('is-on')
    await s.sleep(450)
    q('[data-agent]').textContent = c.agent
    q('[data-time]').textContent = c.time
    el.classList.add('show-work')
    for (const t of c.steps) {
      await s.sleep(460)
      q('[data-steps]').insertAdjacentHTML('beforeend', `<li>${esc(t)}</li>`)
    }
    await s.sleep(350)
    q('[data-c=b]').classList.add('is-on')
    await s.sleep(450)
    q('[data-outhead]').innerHTML = `<span class="al-lamp is-${c.lamp}"></span><b>${esc(c.outcome)}</b>`
    el.classList.add('show-out')
    q('[data-reply]').textContent = c.reply
    await s.sleep(3600)
  })
})

// ------------------------------------------------- routing map: a call travels the cords
define('routing', async (el, s, data) => {
  // Where each node sits and, for an agent, its colour. The labels are data.nodes[key]
  const N = {
    phone: [10, 40], web: [10, 170], mail: [10, 300],
    desk: [270, 170, 'desk'],
    orders: [530, 40, 'orders'], tech: [530, 170, 'tech'], billing: [530, 300, 'billing'],
    review: [790, 110, 'review'], research: [790, 300, 'research'],
    out: [1050, 110], team: [270, 400]
  }
  const W = 190
  const H = 70
  const from = (k) => [N[k][0] + W, N[k][1] + H / 2]
  const to = (k) => [N[k][0], N[k][1] + H / 2]
  const curve = ([x1, y1], [x2, y2]) => `M${x1} ${y1} C ${x1 + 60} ${y1}, ${x2 - 60} ${y2}, ${x2} ${y2}`
  const EDGES = [['phone', 'desk'], ['web', 'desk'], ['mail', 'desk'], ['desk', 'orders'], ['desk', 'tech'], ['desk', 'billing'], ['orders', 'review'], ['tech', 'review'], ['billing', 'review'], ['orders', 'research'], ['tech', 'research'], ['billing', 'research'], ['research', 'review'], ['review', 'out']]
  const dOf = (a, b) => (a === 'desk' && b === 'team')
    ? `M${N.desk[0] + W / 2} ${N.desk[1] + H} L ${N.team[0] + W / 2} ${N.team[1]}`
    : (a === 'research' && b === 'review')
      ? `M${N.research[0] + W / 2} ${N.research[1]} L ${N.review[0] + W / 2} ${N.review[1] + H}`
    : (a === 'orders' && b === 'team')
      ? `M${N.orders[0]} ${N.orders[1] + H - 10} C ${N.orders[0] - 120} ${N.orders[1] + 200}, ${N.team[0] + W + 110} ${N.team[1] + 30}, ${N.team[0] + W} ${N.team[1] + H / 2}`
      : curve(from(a), to(b))
  el.innerHTML = `<div class="al-mapwrap"><svg class="al-map" viewBox="0 0 1250 490" role="img" aria-label="${attr(data.label)}">
    ${EDGES.map(([a, b]) => `<path class="al-map__cord" data-e="${a}-${b}" d="${dOf(a, b)}"/>`).join('')}
    <path class="al-map__cord al-map__cord--team" data-e="desk-team" d="${dOf('desk', 'team')}"/>
    <path class="al-map__cord al-map__cord--team" data-e="orders-team" d="${dOf('orders', 'team')}"/>
    ${Object.entries(N).map(([k, [x, y, a]]) => `<g class="al-map__node${k === 'team' ? ' is-team' : ''}" data-n="${k}">
      <rect x="${x}" y="${y}" width="${W}" height="${H}" rx="10"/>
      <rect class="al-map__tile${a ? ' is-agent' : ''}${k === 'review' ? ' is-light' : ''}" x="${x + 12}" y="${y + 19}" width="32" height="32" rx="8"${a ? ` style="fill:${AGENT[a]}"` : ''}/>
      ${iconSvg(k, { size: 20, x: x + 18, y: y + 25, className: 'al-map__ic' })}
      <text x="${x + 54}" y="${y + 41}">${esc(data.nodes[k])}</text></g>`).join('')}
    <g class="al-map__dots"></g>
  </svg></div><p class="al-map__cap"><span data-q></span><b data-a></b></p>`
  const ROUTES = data.routes
  const dots = $('.al-map__dots', el)
  const cap = $('.al-map__cap', el)
  // A route as timed steps: wait on a node, then ride a cord to the next one, then linger
  // on arrival. The Researcher hands back to the Reviewer along the same cord.
  const stepsOf = (path) => path.flatMap((k, i) => {
    const node = { node: $(`[data-n=${k}]`, el), ms: i ? 220 : 420 }
    if (i === path.length - 1) return [node, { end: true, ms: 1100 }]
    const cord = $(`[data-e="${k}-${path[i + 1]}"]`, el) ?? $(`[data-e="${path[i + 1]}-${k}"]`, el)
    return cord ? [node, { cord, ms: 560 }] : [node]
  })
  // Several messages share nodes and cords, so a part stays lit while any of them holds it
  const holds = new Map()
  const hit = (x) => { holds.set(x, (holds.get(x) ?? 0) + 1); x.classList.add('is-hit') }
  const unhit = (x) => {
    const h = (holds.get(x) ?? 1) - 1
    if (h > 0) return holds.set(x, h)
    holds.delete(x)
    x.classList.remove('is-hit')
  }
  const arrive = (route) => {
    $('[data-q]', el).textContent = route.message
    $('[data-a]', el).textContent = route.outcome
    if (!calm) cap.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: 'cubic-bezier(.2,.7,.2,1)' })
  }
  if (calm) {
    // The end state: the first message's whole route lit, and where it ended up
    stepsOf(ROUTES[0].path).forEach((st) => { if (st.node || st.cord) hit(st.node ?? st.cord) })
    arrive(ROUTES[0])
    return
  }
  // Each message in flight: its dot, where it is in its steps, and the trail it keeps lit
  // (the last node, cord and node, so a lit wake follows the dot and fades behind it)
  const flying = []
  const launch = (route) => {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    dot.setAttribute('class', route.attn ? 'al-map__dot is-attn' : 'al-map__dot')
    dot.setAttribute('r', '9')
    dot.setAttribute('cx', '-40')
    dot.setAttribute('cy', '-40')
    dots.append(dot)
    flying.push({ route, dot, steps: stepsOf(route.path), k: -1, t: 0, trail: [] })
  }
  const light = (f, x) => {
    hit(x)
    f.trail.push(x)
    if (f.trail.length > 3) unhit(f.trail.shift())
  }
  const begin = (f, st) => {
    if (st.node) light(f, st.node)
    else if (st.cord) {
      light(f, st.cord)
      f.dot.classList.add('is-on')
    } else {
      f.dot.classList.remove('is-on')
      arrive(f.route)
    }
  }
  /** Moves one message on by dt ms; false once it has arrived and lingered */
  const advance = (f, dt) => {
    f.t += dt
    for (;;) {
      if (f.k < 0 || f.t >= f.steps[f.k].ms) {
        if (f.k >= 0) f.t -= f.steps[f.k].ms
        if (++f.k >= f.steps.length) return false
        begin(f, f.steps[f.k])
        continue
      }
      const st = f.steps[f.k]
      if (st.cord) {
        const p = st.cord.getPointAtLength(st.cord.getTotalLength() * Math.min(1, f.t / st.ms))
        f.dot.setAttribute('cx', p.x)
        f.dot.setAttribute('cy', p.y)
      }
      return true
    }
  }
  const land = (f) => {
    f.trail.forEach(unhit)
    f.dot.remove()
  }
  // A new message every second or so, never one already on its way, at most four at once
  const GAPS = [1300, 900, 1500, 1100]
  const frame = () => new Promise((done) => {
    const stop = () => { cancelAnimationFrame(id); done(0) }
    const id = requestAnimationFrame((t) => { s.signal.removeEventListener('abort', stop); done(t) })
    s.signal.addEventListener('abort', stop, { once: true })
  })
  let n = 0
  let wait = 0
  let last = 0
  // One frame per turn: s.loop waits while the map is off screen, and dt is capped so a
  // paused map picks up where it left off
  await s.loop(async () => {
    const t = await frame()
    if (s.signal.aborted) return
    const dt = last ? Math.min(50, t - last) : 0
    last = t
    wait -= dt
    const route = ROUTES[n % ROUTES.length]
    if (wait <= 0 && flying.length < 4 && !flying.some((f) => f.route === route)) {
      launch(route)
      wait = GAPS[n++ % GAPS.length]
    }
    for (let i = flying.length - 1; i >= 0; i--) {
      if (advance(flying[i], dt)) continue
      land(flying[i])
      flying.splice(i, 1)
    }
  })
})

// --------------------------------------------------------- the $ limit, as a live control
define('rule', async (el, s, data) => {
  const { min, max, step, start } = data.limit
  const money = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  el.innerHTML = `<div class="al-rule">
    <label class="al-rule__label" for="rule-limit">${esc(data.label)} <output>$${start.toLocaleString('en-US')}</output></label>
    <input id="rule-limit" type="range" min="${min}" max="${max}" step="${step}" value="${start}">
    <p class="al-rule__code"><code>${esc(data.code)} <span>${start}</span></code></p>
    <ul class="al-rule__list">${data.orders.map((o) => `<li data-t="${o.total}"><span class="al-lamp"></span><b>${esc(o.name)}</b><small>${esc(o.what)}</small><em>${money(o.total)}</em><strong></strong></li>`).join('')}</ul>
  </div>`
  const input = $('input', el)
  const paint = () => {
    const v = Number(input.value)
    $('output', el).textContent = '$' + v.toLocaleString('en-US')
    $('code span', el).textContent = v
    $$('li', el).forEach((li) => {
      const auto = Number(li.dataset.t) <= v
      li.classList.toggle('is-wait', !auto)
      $('.al-lamp', li).className = 'al-lamp ' + (auto ? 'is-live' : 'is-attn')
      $('strong', li).textContent = auto ? data.auto : data.wait
    })
  }
  input.addEventListener('input', paint)
  paint()
})

// ----------------------------------------------------------- a flow, step by step, with times
define('flowrun', async (el, s, data) => {
  el.innerHTML = `<div class="al-card al-run"><p class="al-run__say">${esc(data.said)}</p>
    <ol class="al-run__steps">${data.steps.map((st) => `<li>${tile(st.agent)}<span><b>${esc(data.agents[st.agent])}</b> ${esc(st.text)}</span><time>${esc(st.time)}</time></li>`).join('')}</ol>
    <p class="al-run__done"><span class="al-lamp is-live"></span>${esc(data.done)}</p></div>`
  const rows = $$('li', el)
  await s.loop(async () => {
    el.classList.remove('is-done')
    rows.forEach((r) => r.classList.remove('is-on'))
    await s.sleep(600)
    for (const r of rows) {
      r.classList.add('is-on')
      await s.sleep(520)
    }
    el.classList.add('is-done')
    await s.sleep(3000)
  })
})

// ------------------------------------------------------------ the vision model reads a photo
define('scan', async (el, s, data) => {
  const { image, read, reply } = data
  // Each box is a percentage of the photo: left, top, width and height
  const box = (b) => `
      <span class="al-scan__box${b.low ? ' is-low' : ''}" style="left:${b.left}%;top:${b.top}%;width:${b.width}%;height:${b.height}%" data-l="${attr(b.label)}"></span>`
  el.innerHTML = `<div class="al-scan">
    <figure><img src="${attr(image.src)}" alt="${attr(image.alt)}" loading="lazy"><i class="al-scan__line"></i>${data.boxes.map(box).join('')}</figure>
    <div class="al-card al-scan__read"><header>${tile('research')}<b>${esc(read.agent)}</b><small>${esc(read.time)}</small></header><p data-see></p></div>
    <div class="al-card al-scan__reply"><header>${tile('orders')}<b>${esc(reply.agent)}</b><small>${esc(reply.time)}</small></header><p data-say></p></div>
  </div>`
  const SEE = read.text
  const SAY = reply.text
  await s.loop(async () => {
    el.classList.remove('is-scan', 'is-read', 'is-reply')
    $$('.al-scan__box', el).forEach((b) => b.classList.remove('is-on'))
    $('[data-see]', el).textContent = ''
    $('[data-say]', el).textContent = ''
    await s.sleep(500)
    el.classList.add('is-scan')
    await s.sleep(1500)
    for (const b of $$('.al-scan__box', el)) {
      b.classList.add('is-on')
      await s.sleep(520)
    }
    el.classList.remove('is-scan')
    el.classList.add('is-read')
    await s.type($('[data-see]', el), SEE, 70)
    await s.sleep(450)
    el.classList.add('is-reply')
    await s.type($('[data-say]', el), SAY, 70)
    await s.sleep(3200)
  })
})

// ----------------------------------------------------------- an approval, clicked by a person
define('approve', async (el, s, data) => {
  const { buttons } = data
  // How long the request has waited, in seconds, as m:ss; it ticks on four times
  const clock = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
  el.innerHTML = `<article class="al-card al-appr"><header class="al-appr__head"><span class="al-lamp is-attn"></span><b data-h>${esc(data.waiting)}</b><time data-t>${clock(data.waited)}</time></header>
    <div class="al-appr__body"><p>${tile('orders')}<b>${esc(data.agent)}</b> ${esc(data.asks)}</p>
    <dl>${data.details.map((d) => `<dt>${esc(d.term)}</dt><dd>${esc(d.detail)}</dd>`).join('')}</dl>
    <p class="al-appr__rule">${esc(data.rule)}</p>
    <div class="al-appr__btns"><span class="al-btn is-go" data-go>${esc(buttons.approve)}</span><span class="al-btn">${esc(buttons.change)}</span><span class="al-btn is-quiet">${esc(buttons.decline)}</span></div>
    <p class="al-appr__after"><span class="al-lamp is-live"></span>${esc(data.after)}</p></div><i class="al-cursor"></i></article>`
  const head = $('[data-h]', el)
  const lamp = $('.al-appr__head .al-lamp', el)
  const time = $('[data-t]', el)
  await s.loop(async () => {
    el.classList.remove('is-done', 'is-move', 'is-press')
    head.textContent = data.waiting
    lamp.className = 'al-lamp is-attn'
    for (let t = data.waited; t < data.waited + 4; t++) {
      time.textContent = clock(t)
      await s.sleep(650)
    }
    // Aim at the button wherever the card's layout has put it
    const go = $('[data-go]', el).getBoundingClientRect()
    const at = $('.al-cursor', el).getBoundingClientRect()
    el.style.setProperty('--to-x', `${go.left + go.width * 0.6 - at.left}px`)
    el.style.setProperty('--to-y', `${go.top + go.height * 0.55 - at.top}px`)
    el.classList.add('is-move')
    await s.sleep(900)
    el.classList.add('is-press')
    await s.sleep(260)
    el.classList.remove('is-press')
    head.textContent = data.approved
    lamp.className = 'al-lamp is-live'
    time.textContent = ''
    el.classList.add('is-done')
    await s.sleep(3400)
  })
})

// ------------------------------------------------------- answers come with a score and a source
define('cite', async (el, s, data) => {
  const under = (p) => p.score < data.threshold
  const card = (p) => `<article class="al-card${under(p) ? ' is-under' : ''}" data-v="${p.score}"><header><b>${esc(p.title)}</b><span class="al-bar"><i></i></span><em>${p.score.toFixed(2)}</em></header><p>${esc(p.text)}</p></article>`
  // The bar sits between the passages that clear it and those that don't
  el.innerHTML = `<div class="al-cite"><p class="al-cite__q">${esc(data.question)}</p>
    ${data.passages.filter((p) => !under(p)).map(card).join('')}<p class="al-cite__bar"><span>${esc(data.bar)}</span></p>${data.passages.filter(under).map(card).join('')}</div>`
  const cards = $$('article', el)
  await s.loop(async () => {
    cards.forEach((c) => { c.classList.remove('is-on'); $('.al-bar i', c).style.transform = 'scaleX(0)' })
    await s.sleep(500)
    for (const c of cards) {
      c.classList.add('is-on')
      await s.sleep(120)
      $('.al-bar i', c).style.transform = `scaleX(${c.dataset.v})`
      await s.sleep(800)
    }
    await s.sleep(3000)
  })
})

// --------------------------------------------------------------- documents become passages
define('ingest', async (el, s, data) => {
  el.innerHTML = `<div class="al-card al-ingest"><ul>${data.documents.map((d) => `<li><span>${esc(d.name)}</span><i class="al-bar"><i></i></i><em data-p="${d.passages}"></em></li>`).join('')}</ul><p><b data-n>0</b> ${esc(data.total)}</p></div>`
  const rows = $$('li', el)
  const total = $('[data-n]', el)
  await s.loop(async () => {
    let n = 0
    total.textContent = '0'
    rows.forEach((r) => { $('.al-bar i', r).style.transform = 'scaleX(0)'; $('em', r).textContent = '' })
    await s.sleep(500)
    for (const r of rows) {
      $('.al-bar i', r).style.transform = 'scaleX(1)'
      await s.sleep(460)
      const p = Number($('em', r).dataset.p)
      $('em', r).textContent = `${p} ${p === 1 ? data.unit.one : data.unit.other}`
      n += p
      total.textContent = n
    }
    await s.sleep(3000)
  })
})

// -------------------------------------------------------------------------- store import
define('import', async (el, s, data) => {
  el.innerHTML = `<div class="al-import">${data.files.map((f) => `<article class="al-card"><header><b>${esc(f.title)}</b></header><p class="al-import__n" data-n="${f.count}">0</p><p class="al-import__ok"><span class="al-lamp is-live"></span><span data-r></span></p><small>${esc(f.file)}</small></article>`).join('')}</div>`
  const cards = $$('article', el)
  await s.loop(async () => {
    cards.forEach((c) => { $('[data-n]', c).textContent = '0'; $('[data-r]', c).textContent = data.reading; c.classList.remove('is-done') })
    await s.sleep(500)
    for (const c of cards) {
      const box = $('[data-n]', c)
      const n = Number(box.dataset.n)
      for (let i = 1; i <= 24; i++) {
        box.textContent = Math.round((n * i) / 24)
        await s.sleep(28)
      }
      $('[data-r]', c).textContent = data.done.replace('{n}', n)
      c.classList.add('is-done')
      await s.sleep(260)
    }
    await s.sleep(3200)
  })
})

// ---------------------------------------------------------------------- a phone call, live
define('call', async (el, s, data) => {
  const clock = (sec) => `0:${String(sec % 60).padStart(2, '0')}`
  el.innerHTML = `<div class="al-card al-call"><header><span class="al-lamp is-live"></span><b>${esc(data.title)}</b><time data-t>${clock(data.clock)}</time></header>
    <div class="al-wave" aria-hidden="true">${Array.from({ length: 28 }, (_, i) => `<i style="animation-delay:${-(i * 83) % 700}ms"></i>`).join('')}</div>
    <p class="al-call__doing" data-d></p><p class="al-call__cap" data-c></p></div>`
  const box = $('.al-call', el)
  const t = $('[data-t]', el)
  let sec = data.clock
  await s.loop(async () => {
    // The wave moves while someone is speaking, that is while a line has a caption
    for (const { status: doing, caption: cap } of data.lines) {
      $('[data-d]', el).textContent = doing
      $('[data-c]', el).textContent = ''
      box.classList.toggle('is-wave', !!cap)
      t.textContent = clock(sec++)
      if (cap) await s.type($('[data-c]', el), cap, 30)
      await s.sleep(cap ? 1500 : 1300)
    }
  })
})

// ---------------------------------------------------------------- the customer's language
define('translate', async (el, s, data) => {
  // The real path of one message on the test day: template, filled from the order, translated
  el.innerHTML = `<div class="al-card al-tr"><p class="al-bub al-bub--me" data-q></p>
    ${data.stages.map((st) => `<div class="al-tr__stage"><small>${esc(st.label)}</small><p>${marked(st.text)}</p></div>`).join('')}
    <p class="al-tr__note">${esc(data.note)}</p></div>`
  const rows = $$('.al-tr__stage', el)
  await s.loop(async () => {
    rows.forEach((r) => r.classList.remove('is-on'))
    await s.type($('[data-q]', el), data.message, 40)
    for (const r of rows) {
      await s.sleep(700)
      r.classList.add('is-on')
    }
    await s.sleep(3600)
  })
})

// ------------------------------------------------------------------------ a day on the dial
define('hours', async (el, s, data) => {
  const { open, close } = data
  const cx = 200
  const R = 150
  const pt = (h, r = R) => { const a = ((h / 24) * 360 - 90) * (Math.PI / 180); return [cx + r * Math.cos(a), cx + r * Math.sin(a)] }
  const [ax, ay] = pt(open)
  const [bx, by] = pt(close)
  const CALLS = data.calls
  // At rest (and with reduced motion) the hand stops on the day's last call
  const last = CALLS[CALLS.length - 1]
  el.innerHTML = `<div class="al-hours"><svg viewBox="0 0 400 400" role="img" aria-label="${attr(data.label)}">
    <circle class="al-hours__ring" cx="${cx}" cy="${cx}" r="${R}"/>
    <path class="al-hours__open" d="M${ax} ${ay} A ${R} ${R} 0 0 1 ${bx} ${by}"/>
    ${Array.from({ length: 24 }, (_, h) => { const [x1, y1] = pt(h, R - 12); const [x2, y2] = pt(h, R - (h % 6 ? 20 : 28)); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>` }).join('')}
    ${[0, 6, 12, 18].map((h) => { const [x, y] = pt(h, R + 24); return `<text x="${x}" y="${y + 6}">${String(h).padStart(2, '0')}</text>` }).join('')}
    ${CALLS.map((h) => { const [x, y] = pt(h, R); return `<circle class="al-hours__call" data-h="${h}" cx="${x}" cy="${y}" r="9"/>` }).join('')}
    <line class="al-hours__hand" x1="${cx}" y1="${cx}" x2="${cx}" y2="${cx - R + 34}"/><circle class="al-hours__pin" cx="${cx}" cy="${cx}" r="7"/>
  </svg><div class="al-hours__read"><time data-t></time><p data-w></p></div></div>`
  const hand = $('.al-hours__hand', el)
  const dots = $$('.al-hours__call', el)
  const fmt = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.floor((h % 1) * 60)).padStart(2, '0')}`
  const paint = (h) => {
    hand.setAttribute('transform', `rotate(${(h / 24) * 360} ${cx} ${cx})`)
    $('[data-t]', el).textContent = fmt(h)
    $('[data-w]', el).textContent = h >= open && h < close ? data.during : data.after
    dots.forEach((d) => d.classList.toggle('is-on', Number(d.dataset.h) <= h))
  }
  if (calm) { paint(last); return }
  await s.loop(async () => {
    for (let h = 0; h < 24; h += 0.08) {
      paint(h)
      await s.sleep(40)
    }
    paint(last)
    await s.sleep(2400)
  })
})

// --------------------------------------------------------- everything inside one machine
define('private', async (el, s, data) => {
  // Where each module sits; its label is data.modules[key]
  const M = { model: [90, 80], search: [420, 80], vision: [90, 300], voice: [420, 300], db: [255, 190] }
  const W = 200
  const H = 64
  const c = (k) => [M[k][0] + W / 2, M[k][1] + H / 2]
  const LINKS = [['db', 'model'], ['db', 'search'], ['db', 'vision'], ['db', 'voice']]
  el.innerHTML = `<div class="al-priv"><svg viewBox="0 0 900 440" role="img" aria-label="${attr(data.label)}">
    <rect class="al-priv__pc" x="40" y="30" width="640" height="380" rx="18"/><text class="al-priv__t" x="64" y="64">${esc(data.computer)}</text>
    ${LINKS.map(([a, b]) => { const [x1, y1] = c(a); const [x2, y2] = c(b); return `<path class="al-priv__link" d="M${x1} ${y1} L${x2} ${y2}"/>` }).join('')}
    ${Object.entries(M).map(([k, [x, y]]) => `<g class="al-priv__mod"><rect x="${x}" y="${y}" width="${W}" height="${H}" rx="10"/><text x="${x + W / 2}" y="${y + 39}">${esc(data.modules[k])}</text></g>`).join('')}
    <circle class="al-map__dot" r="8" cx="-40" cy="-40"/>
    <path class="al-priv__cable" d="M680 220 L 742 220"/><path class="al-priv__cable" d="M790 220 C 830 220, 830 330, 880 400"/>
    <rect class="al-priv__plug" x="742" y="208" width="24" height="24" rx="3"/><text class="al-priv__t" x="716" y="186">${esc(data.unplugged)}</text>
  </svg><p class="al-priv__n">${esc(data.sent)} <b data-n>0</b></p></div>`
  const dot = $('.al-map__dot', el)
  const links = $$('.al-priv__link', el)
  let n = 0
  await s.loop(async () => {
    const l = links[n++ % links.length]
    await along(l, dot, calm ? 0 : 620, s.signal)
    await s.sleep(120)
  })
})

// ---------------------------------------------------------------- what runs on which machine
define('tiers', async (el, s, data) => {
  const T = data.tiers
  const names = T.map((t) => t.name)
  el.innerHTML = `<div class="al-card al-tiers"><div class="al-tiers__tabs" role="tablist">${names.map((n) => `<button role="tab" data-t="${attr(n)}">${esc(n)}</button>`).join('')}</div>
    <p class="al-tiers__need" data-need></p><p class="al-tiers__gauge"><i></i></p><p class="al-tiers__used" data-used></p><dl data-list></dl></div>`
  let held = false
  let at = Math.max(0, names.indexOf(data.start))
  const show = (name) => {
    const t = T.find((x) => x.name === name)
    $$('[data-t]', el).forEach((b) => b.classList.toggle('is-on', b.dataset.t === name))
    $('[data-need]', el).textContent = t.need
    $('[data-used]', el).textContent = t.used
    $('.al-tiers__gauge i', el).style.transform = `scaleX(${t.fill})`
    $('[data-list]', el).innerHTML = t.models.map((m) => `<dt>${esc(m.job)}</dt><dd>${esc(m.model)}</dd><dd class="q">${esc(m.runs)}</dd>`).join('')
  }
  $$('[data-t]', el).forEach((b) => b.addEventListener('click', () => { held = true; show(b.dataset.t) }))
  show(names[at])
  if (calm) return
  await s.loop(async () => {
    await s.sleep(3800)
    if (held) return
    at = (at + 1) % names.length
    show(names[at])
  })
})

// ------------------------------------------------- real exchanges from the test day, typed
define('chat', async (el, s, S) => {
  el.innerHTML = `<div class="al-chat"><header><span class="al-lamp is-live"></span><b data-who></b><small data-tag></small></header><div class="al-chat__body" data-b></div></div>`
  const body = $('[data-b]', el)
  let n = 0
  await s.loop(async () => {
    const c = S[n++ % S.length]
    $('[data-who]', el).textContent = c.who
    $('[data-tag]', el).textContent = c.tag
    body.innerHTML = ''
    await s.sleep(400)
    for (const { from, text } of c.lines) {
      const me = from === 'customer'
      const p = document.createElement('p')
      p.className = 'al-bub' + (me ? ' al-bub--me' : '')
      body.append(p)
      await s.type(p, text, me ? 42 : 80)
      await s.sleep(500)
    }
    await s.sleep(3000)
  })
})

// ---------------------------------------------------------- a stepper that advances itself
define('stepper', async (el, s, data) => {
  const items = $$('[data-st]', el)
  const views = $$('[data-sv]', el)
  const ms = Number(data?.ms || 6000)
  el.style.setProperty('--step-ms', ms + 'ms')
  let at = 0
  let held = false
  const show = (n) => {
    at = n
    items.forEach((x, i) => {
      x.classList.remove('is-on')
      if (i === n) { void x.offsetWidth; x.classList.add('is-on') }
      x.setAttribute('aria-selected', String(i === n))
    })
    views.forEach((v, i) => v.classList.toggle('is-on', i === n))
  }
  items.forEach((x, i) => x.addEventListener('click', () => { held = true; el.classList.add('is-held'); show(i) }, { signal: s.signal }))
  show(0)
  if (calm) return
  await s.loop(async () => {
    await s.sleep(ms)
    if (!held) show((at + 1) % items.length)
  })
})

// ----------------------------------------------------------------- a rotary dial for the FAQ
define('dial', async (el, s, faq) => {
  const QA = faq.map(({ question, answer }) => ({ q: question, a: answer }))
  const cx = 200
  const n = QA.length
  const R = 128
  // As on a real dial: 1 sits just before the finger stop at 4 o'clock, and the holes run
  // back anticlockwise, so 1 turns the least and 0 the most
  const stop = 120
  const ang = (i) => 60 - i * 30
  const pos = (a, r) => { const t = ((a - 90) * Math.PI) / 180; return [cx + r * Math.cos(t), cx + r * Math.sin(t)] }
  const label = (i) => (i === 9 ? '0' : String(i + 1))
  el.innerHTML = `<div class="al-dial"><svg viewBox="0 0 400 400" class="al-dial__svg" aria-hidden="false" role="group" aria-label="Rotary dial: each number is a question">
    <defs><mask id="dial-holes"><rect width="400" height="400" fill="#fff"/>${QA.map((_, i) => { const [x, y] = pos(ang(i), R); return `<circle cx="${x}" cy="${y}" r="26" fill="#000"/>` }).join('')}<circle cx="200" cy="200" r="58" fill="#000"/></mask></defs>
    <circle class="al-dial__face" cx="200" cy="200" r="184"/>
    ${QA.map((_, i) => { const [x, y] = pos(ang(i), R); return `<text class="al-dial__num" x="${x}" y="${y + 9}">${label(i)}</text>` }).join('')}
    <g class="al-dial__plate"><circle cx="200" cy="200" r="168" mask="url(#dial-holes)"/></g>
    <circle class="al-dial__hub" cx="200" cy="200" r="50"/><text class="al-dial__hubt" x="200" y="207">FAQ</text>
    ${(() => { const [x1, y1] = pos(stop, 150); const [x2, y2] = pos(stop, 186); return `<line class="al-dial__stop" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>` })()}
    ${calm ? '' : '<circle class="al-dial__ring" r="33" pathLength="1"/>'}
    ${QA.map((c, i) => { const [x, y] = pos(ang(i), R); return `<circle class="al-dial__hit" data-i="${i}" cx="${x}" cy="${y}" r="27" tabindex="0" role="button" aria-label="${attr(c.q)}"/>` }).join('')}
  </svg><div class="al-dial__panel" aria-live="polite"><small data-c></small><h3 data-q></h3><p data-a></p><p class="al-dial__nav"><button class="btn btn--line" data-p aria-label="Previous question"><span class="btn__label">Previous</span></button><button class="btn btn--line" data-n aria-label="Next question"><span class="btn__label">Next</span></button></p></div></div>`
  const plate = $('.al-dial__plate', el)
  const panel = $('.al-dial__panel', el)
  // The ring round the current number fills while the visitor reads, and when it closes the
  // dial turns to the next question. Any pick starts it again; pointing at the dial or
  // keyboard focus inside it holds it.
  const ring = $('.al-dial__ring', el)
  const readFor = (i) => 4500 + QA[i].a.length * 20
  let read = 0
  let at = 0
  let timer = 0
  s.signal.addEventListener('abort', () => clearTimeout(timer), { once: true })
  const place = () => {
    if (!ring) return
    const [x, y] = pos(ang(at), R)
    ring.setAttribute('cx', x)
    ring.setAttribute('cy', y)
    ring.setAttribute('transform', `rotate(-90 ${x} ${y})`)
    ring.classList.remove('is-run')
    ring.style.strokeDashoffset = '1'
    // Wait out the plate's turn and return before the ring starts to fill
    read = -1400
  }
  const show = (i, user = true) => {
    at = (i + n) % n
    // Only a visitor's own pick is read out; the dial turning by itself stays quiet
    panel.setAttribute('aria-live', user ? 'polite' : 'off')
    place()
    $('[data-c]', el).textContent = `Question ${at + 1} of ${n}`
    $('[data-q]', el).textContent = QA[at].q
    $('[data-a]', el).textContent = QA[at].a
    $$('.al-dial__hit', el).forEach((h, k) => h.classList.toggle('is-on', k === at))
  }
  const spin = (i, user = true) => {
    show(i, user)
    if (calm) return
    clearTimeout(timer)
    plate.style.transition = 'transform .55s cubic-bezier(.3,.7,.3,1)'
    plate.style.transform = `rotate(${stop - ang(at)}deg)`
    timer = setTimeout(() => {
      plate.style.transition = 'transform .8s cubic-bezier(.4,.1,.3,1)'
      plate.style.transform = 'rotate(0deg)'
    }, 620)
  }
  $$('.al-dial__hit', el).forEach((h) => {
    const i = Number(h.dataset.i)
    h.addEventListener('click', () => spin(i))
    h.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); spin(i) } })
  })
  $('[data-p]', el).addEventListener('click', () => spin(at - 1))
  $('[data-n]', el).addEventListener('click', () => spin(at + 1))
  show(0, false)
  if (calm) return
  const dial = $('.al-dial', el)
  let hover = false
  dial.addEventListener('pointerenter', () => (hover = true), { signal: s.signal })
  dial.addEventListener('pointerleave', () => (hover = false), { signal: s.signal })
  let last = 0
  // s.sleep stops counting while the dial is off screen; dt is capped so it resumes in place
  await s.loop(async () => {
    await s.sleep(100)
    const now = performance.now()
    const dt = last ? Math.min(150, now - last) : 0
    last = now
    const held = hover || !!$(':focus-visible', dial)
    ring.classList.toggle('is-held', held)
    if (held) return
    read += dt
    if (read <= 0) return
    const k = Math.min(1, read / readFor(at))
    ring.classList.add('is-run')
    ring.style.strokeDashoffset = String(1 - k)
    if (k === 1) spin(at + 1, false)
  })
})

/**
 * Starts the vignette called name inside el and returns its cleanup. Vignettes that build their
 * own markup are emptied again; the stepper only drives markup React rendered, so it is left.
 */
export function mountAlive(name, el, data) {
const fn = registry[name]
if (!fn) return () => {}
calm = matchMedia('(prefers-reduced-motion: reduce)').matches
const cls = el.className
const style = el.getAttribute('style')
const ctl = new AbortController()
fn(el, stageOf(el, ctl.signal), data).catch((e) => { if (e !== ABORT) console.error(name, e) })
return () => {
  ctl.abort()
  if (name !== 'stepper') el.replaceChildren()
  el.className = cls
  if (style === null) el.removeAttribute('style')
  else el.setAttribute('style', style)
}
}
