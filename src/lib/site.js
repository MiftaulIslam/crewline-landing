// The page's small amount of behaviour: the cord, the menu, the back-to-top ring, things that
// rise into view, hover photos, the stepped setup guide, rotating screens, films that play only
// on screen, the story film and the cost slider. initSite() runs once per page and returns a
// cleanup that removes every listener, observer and timer it added.

/** @returns {() => void} */
export function initSite() {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
  const $$ = (s, r = document) => [...r.querySelectorAll(s)]
  const ctl = new AbortController()
  const on = { signal: ctl.signal }
  const observers = []
  const intervals = []
  const watch = (o) => (observers.push(o), o)

  // ---------------------------------------------------------------- the cord
  const svg = document.getElementById('cord')
  const base = document.getElementById('cord-base')
  const weave = document.getElementById('cord-weave')
  const clip = document.getElementById('cord-clip-rect')
  const plug = document.getElementById('cord-plug')
  const jacks = $$('[data-jack]')
  let table = []
  let total = 0
  let spots = []

  const pageY = (el) => el.getBoundingClientRect().top + scrollY
  const pageX = (el) => el.getBoundingClientRect().left + scrollX

  function layoutCord() {
    if (!jacks.length || getComputedStyle(svg).display === 'none') return
    // Measure the page without the cord, or a cord sized for a longer page keeps it long
    svg.style.height = '0px'
    const height = document.documentElement.scrollHeight
    svg.setAttribute('height', height)
    svg.style.height = height + 'px'
    spots = jacks
      .map((j) => ({ el: j, x: pageX(j) + j.offsetWidth / 2, y: pageY(j) + j.offsetHeight / 2 }))
      .sort((a, b) => a.y - b.y)
    let d = `M ${spots[0].x} 0 L ${spots[0].x} ${spots[0].y}`
    for (let i = 1; i < spots.length; i++) {
      const a = spots[i - 1]
      const b = spots[i]
      const dy = b.y - a.y
      // A cord hangs: it leaves a jack and comes into the next along the vertical
      d += ` C ${a.x} ${a.y + dy * 0.55}, ${b.x} ${b.y - dy * 0.55}, ${b.x} ${b.y}`
    }
    base.setAttribute('d', d)
    weave.setAttribute('d', d)
    total = base.getTotalLength()
    table = []
    for (let l = 0; l <= total; l += 24) table.push([l, base.getPointAtLength(l).y])
    paintCord()
  }

  function lengthAt(y) {
    let lo = 0
    let hi = table.length - 1
    while (lo < hi) {
      const m = (lo + hi) >> 1
      if (table[m][1] < y) lo = m + 1
      else hi = m
    }
    return table[lo] ? table[lo][0] : total
  }

  function paintCord() {
    if (!table.length) return
    const last = spots[spots.length - 1].y
    // The head runs ahead of the fold, and reaches the last jack as the page ends
    const left = document.documentElement.scrollHeight - scrollY - innerHeight
    const ahead = 0.66 + 0.34 * Math.max(0, 1 - left / innerHeight)
    const y = calm ? last : Math.min(last, scrollY + innerHeight * ahead)
    clip.setAttribute('height', y)
    const l = lengthAt(y)
    const p = base.getPointAtLength(l)
    const q = base.getPointAtLength(Math.max(0, l - 8))
    const angle = (Math.atan2(p.y - q.y, p.x - q.x) * 180) / Math.PI - 90
    plug.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${angle})`)
    plug.style.display = y >= last ? 'none' : ''
    for (const s of spots) s.el.classList.toggle('is-lit', s.y <= y + 1)
  }

  // ------------------------------------------------- back to the top: a lamp and a ring
  const bar = document.querySelector('.bar')
  const ring = document.querySelector('.ring')
  const ringFill = document.querySelector('.ring__fill')
  function paintRing() {
    const range = document.documentElement.scrollHeight - innerHeight
    ring.classList.toggle('is-on', scrollY > innerHeight * 0.6)
    ringFill.style.strokeDashoffset = String(1 - Math.min(1, scrollY / range))
  }

  let queued = false
  const paintScroll = () => {
    paintCord()
    bar.classList.toggle('is-solid', scrollY > innerHeight * 0.6)
    paintRing()
  }
  const onScroll = () => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      if (!ctl.signal.aborted) paintScroll()
    })
  }
  addEventListener('scroll', onScroll, { passive: true, signal: ctl.signal })
  addEventListener('resize', layoutCord, on)
  addEventListener('load', layoutCord, on)
  watch(new ResizeObserver(layoutCord)).observe(document.body)
  document.fonts?.ready.then(() => { if (!ctl.signal.aborted) layoutCord() })
  layoutCord()
  paintScroll()

  // ---------------------------------------------------------------------------- the menu
  const mega = document.getElementById('mega')
  const megaBtn = document.querySelector('.bar__item > button')
  const megaPic = document.querySelector('.mega__pic img')
  const openMega = (open) => {
    mega.classList.toggle('is-open', open)
    megaBtn.setAttribute('aria-expanded', String(open))
  }
  megaBtn.addEventListener('click', () => openMega(!mega.classList.contains('is-open')), on)
  $$('a[data-img]', mega).forEach((a) => {
    const show = () => { megaPic.src = a.dataset.img }
    a.addEventListener('mouseenter', show, on)
    a.addEventListener('focus', show, on)
  })
  addEventListener('keydown', (e) => { if (e.key === 'Escape') openMega(false) }, on)
  document.addEventListener('click', (e) => { if (!e.target.closest('.bar__item')) openMega(false) }, on)
  const menuBtn = document.querySelector('.bar__menu')
  const openMenu = (open) => {
    bar.classList.toggle('is-open', open)
    menuBtn.setAttribute('aria-expanded', String(open))
    menuBtn.textContent = open ? 'Close' : 'Menu'
  }
  menuBtn.addEventListener('click', () => openMenu(!bar.classList.contains('is-open')), on)

  // ------------------------------------------------------------- things rise as they arrive
  const riser = watch(new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue
      e.target.classList.add('in')
      riser.unobserve(e.target)
    }
  }, { rootMargin: '0px 0px -8% 0px' }))
  $$('[data-rise]').forEach((el) => riser.observe(el))

  // ------------------------------------------------- lists where a photo follows the pointer
  $$('.float').forEach((float) => {
    const pics = $$('img', float)
    $$('[data-float]', float.closest('section')).forEach((li) => {
      const n = Number(li.dataset.float)
      li.addEventListener('mouseenter', () => {
        pics.forEach((p, i) => p.classList.toggle('is-on', i === n))
        float.classList.add('is-on')
      }, on)
      li.addEventListener('mouseleave', () => float.classList.remove('is-on'), on)
      li.addEventListener('mousemove', (e) => {
        float.style.transform = `translate(${e.clientX + 28}px, ${e.clientY - 120}px) rotate(-1.5deg)`
      }, on)
    })
  })

  // --------------------------------------------------------------- setup guide: step by step
  const steps = $$('[data-step]')
  const stage = $$('.guide__stage img')
  const setStep = (n) => {
    steps.forEach((s, i) => s.classList.toggle('is-on', i === n))
    stage.forEach((s, i) => s.classList.toggle('is-on', i === n))
  }
  if (steps.length) setStep(0)
  const stepWatch = watch(new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) setStep(Number(e.target.dataset.step))
    },
    { rootMargin: '-45% 0px -45% 0px' }
  ))
  steps.forEach((s) => stepWatch.observe(s))

  // ----------------------------------------------------- rotating screens, tabs that hold them
  $$('[data-rotate]').forEach((box) => {
    const slides = $$('[data-slide]', box)
    const tabs = $$('[data-tab]', box)
    let at = 0
    let held = false
    let seen = false
    const show = (n) => {
      at = n
      slides.forEach((s, i) => s.classList.toggle('is-on', i === n))
      tabs.forEach((t, i) => {
        t.classList.toggle('is-on', i === n)
        t.setAttribute('aria-selected', String(i === n))
      })
    }
    tabs.forEach((t, i) => {
      t.addEventListener('mouseenter', () => { held = true; show(i) }, on)
      t.addEventListener('mouseleave', () => { held = false }, on)
      t.addEventListener('focus', () => { held = true; show(i) }, on)
      t.addEventListener('blur', () => { held = false }, on)
      t.addEventListener('click', () => show(i), on)
    })
    watch(new IntersectionObserver(([e]) => { seen = e.isIntersecting })).observe(box)
    if (!calm) {
      intervals.push(setInterval(() => {
        if (seen && !held && !document.hidden) show((at + 1) % slides.length)
      }, Number(box.dataset.rotate)))
    }
  })

  // ------------------------------------------------------------ films play only when on screen
  const filmWatch = watch(new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) e.target.play().catch(() => {})
        else e.target.pause()
      }
    },
    { threshold: 0.15 }
  ))
  if (!calm) $$('[data-lazy-video], .film--hero video').forEach((v) => filmWatch.observe(v))
  else document.querySelector('.film--hero video')?.pause()

  // ------------------------------------------------------------------------- the story film
  const story = document.getElementById('story-film')
  if (story) {
    const section = document.getElementById('story')
    document.getElementById('story-play').addEventListener('click', () => {
      story.muted = false
      story.controls = true
      section.classList.add('is-playing')
      story.play().catch(() => section.classList.remove('is-playing'))
    }, on)
    story.addEventListener('ended', () => {
      story.controls = false
      section.classList.remove('is-playing')
    }, on)
  }

  // ------------------------------------------------------------------------ the cost slider
  const volume = document.getElementById('volume')
  if (volume) {
    const money = (n) => '$' + Math.round(n).toLocaleString('en-US')
    const rate = Number(volume.closest('.meter')?.dataset.rate ?? 0)
    const paintCost = () => {
      const n = Number(volume.value)
      document.getElementById('volume-out').textContent = n.toLocaleString('en-US')
      document.getElementById('cost-out').textContent = money(n * rate)
    }
    volume.addEventListener('input', paintCost, on)
    paintCost()
  }

  return () => {
    ctl.abort()
    observers.forEach((o) => o.disconnect())
    intervals.forEach(clearInterval)
    // The header outlives the page: leave its menus closed for the next one
    openMega(false)
    openMenu(false)
  }
}
