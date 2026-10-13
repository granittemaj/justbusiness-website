// Just Business: shared site behaviour. Page features switch on via data attributes.
(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const D = window.JB;
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const AR = '<svg aria-hidden="true"><use href="#ar"/></svg>', NE = '<svg aria-hidden="true"><use href="#ne"/></svg>';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  document.documentElement.classList.add('js');

  /* ---------- nav, mobile menu, back to top ---------- */
  const nav = $('.nav'), sheet = $('#sheet'), burger = $('#burger'), totop = $('#totop');
  const onScroll = () => { nav.classList.toggle('solid', scrollY > 30); if (totop) totop.classList.toggle('on', scrollY > innerHeight); };
  addEventListener('scroll', onScroll, {passive:true}); onScroll();
  function setMenu(open){
    nav.classList.toggle('open', open); sheet.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    sheet.setAttribute('aria-hidden', !open); document.body.style.overflow = open ? 'hidden' : '';
  }
  burger && burger.addEventListener('click', () => setMenu(!sheet.classList.contains('open')));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  $$('#sheet a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---------- data-driven blocks ---------- */
  const themeDot = t => t === 'freedom' ? 'o' : 'c';
  const themeName = t => t === 'freedom' ? 'Freedom' : 'Planet';
  $$('[data-ventures="cards"]').forEach(el => {
    el.innerHTML = D.ventures.map((v, i) => `<a class="card v rv${v.theme === 'freedom' ? ' fr' : ''}" style="--d:${i * .05}s" href="venture.html?v=${v.slug}"><span class="dot ${themeDot(v.theme)}"></span><span class="t">${esc(v.sector)}</span><div><h3>${esc(v.name)}</h3><p>${esc(v.line)}</p></div></a>`).join('');
  });
  $$('[data-ventures="photo"]').forEach(el => {
    el.innerHTML = D.ventures.map((v, i) => `<a class="card pc rv${v.theme === 'freedom' ? ' fr' : ''}" style="--d:${(i % 3) * .06}s" data-theme="${v.theme}" href="venture.html?v=${v.slug}"><div class="im"><img src="${v.image.replace('w=1600', 'w=800')}" alt="${esc(v.imageAlt)}" loading="lazy" width="800" height="500"><span class="chip ${themeDot(v.theme)}"><i></i>${themeName(v.theme)}</span></div><div class="bd"><small>${esc(v.sector)} · ${esc(v.place)}</small><h3>${esc(v.name)}</h3><p>${esc(v.outcome)}</p><span class="more">View venture${AR}</span></div></a>`).join('')
      + `<a class="card pc rv fr" data-theme="freedom" href="not-for-sale.html"><div class="im" style="background:radial-gradient(80% 80% at 30% 20%,rgba(245,130,31,.45),#140B05)"><span class="chip o"><i></i>Partner</span></div><div class="bd"><small>Non-profit · Since 2007</small><h3>Not For Sale</h3><p>Where it all began: the movement out-creating slavery and ecocide.</p><span class="more">The partnership${AR}</span></div></a>`;
  });
  const tagClass = t => ({Planet:'c', Freedom:'o'}[t] || '');
  $$('[data-news]').forEach(el => {
    const mode = el.dataset.news, n = +(el.dataset.limit || 99), only = el.dataset.venture;
    const items = D.news.filter(x => !only || x.v === only).slice(0, n);
    if (!items.length) { el.closest('[data-news-wrap]') && el.closest('[data-news-wrap]').remove(); return; }
    el.innerHTML = mode === 'cards'
      ? items.map((x, i) => `<a class="card nc rv" style="--d:${i * .06}s" href="${D.NEWS_URL}" rel="noopener"><div class="meta"><time datetime="${x.date}">${D.fmt(x.date)}</time><span class="${tagClass(x.tag) === 'o' ? 'or' : tagClass(x.tag) === 'c' ? 'cy' : ''}">${x.tag}</span></div><h3>${esc(x.title)}</h3><span class="more">Read on justbusiness.is${NE}</span></a>`).join('')
      : items.map(x => `<li class="rv"><a href="${D.NEWS_URL}" rel="noopener"><time datetime="${x.date}">${D.fmt(x.date)}</time><h3>${esc(x.title)}</h3><span class="tg ${tagClass(x.tag)}">${x.tag}</span>${NE}</a></li>`).join('');
  });

  /* ---------- venture detail page ---------- */
  const vd = $('[data-venture-page]');
  if (vd) {
    const slug = new URLSearchParams(location.search).get('v'), i = D.ventures.findIndex(v => v.slug === slug), v = D.ventures[i];
    if (!v) { location.replace('ventures.html'); return; }
    document.title = `${v.name} | Just Business`;
    const next = D.ventures[(i + 1) % D.ventures.length];
    $('#vd-img').src = v.image; $('#vd-img').alt = v.imageAlt;
    $('#vd-name').textContent = v.name; $('#vd-crumb').textContent = v.name;
    $('#vd-chip').className = 'chip ' + themeDot(v.theme); $('#vd-chip').lastChild.textContent = themeName(v.theme);
    $('#vd-sector').textContent = `${v.sector} · ${v.place}`;
    $('#vd-outcome').textContent = v.outcome;
    $('#vd-biz').textContent = v.business; $('#vd-imp').textContent = v.impact;
    $('#vd-facts').innerHTML = v.facts.map(f => `<div class="card fact rv"><b>${esc(f[0])}</b><span>${esc(f[1])}</span><small>${esc(f[2])}</small></div>`).join('');
    $('#vd-place').textContent = v.place;
    $('#vd-next').href = 'venture.html?v=' + next.slug; $('#vd-next-name').textContent = next.name;
    $('#vd-news').dataset.venture = v.slug;
    const list = $('#vd-news');
    const items = D.news.filter(x => x.v === v.slug);
    if (items.length) list.innerHTML = items.map(x => `<li class="rv"><a href="${D.NEWS_URL}" rel="noopener"><time datetime="${x.date}">${D.fmt(x.date)}</time><h3>${esc(x.title)}</h3><span class="tg ${tagClass(x.tag)}">${x.tag}</span>${NE}</a></li>`).join('');
    else $('#vd-news-wrap').remove();
    window.__venture = v;
  }

  /* ---------- reveals ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {rootMargin:'0px 0px -8% 0px'});
  $$('.rv').forEach(el => io.observe(el));
  setTimeout(() => $$('[data-hero] .rv').forEach(el => { el.classList.add('in'); io.unobserve(el); }), 150);

  /* ---------- ventures filter ---------- */
  $$('[data-filter]').forEach(group => {
    const target = $(group.dataset.filter);
    $$('button', group).forEach(b => b.addEventListener('click', () => {
      $$('button', group).forEach(o => o.setAttribute('aria-pressed', o === b));
      $$('.pc', target).forEach(c => c.classList.toggle('hidden', !(b.dataset.f === 'all' || c.dataset.theme === b.dataset.f)));
    }));
  });

  /* ---------- four bottom lines ---------- */
  const lines = $('[data-lines]');
  if (lines) {
    const pillars = $$('.pillar', lines), parts = $$('.lmark .p', lines);
    const act = p => { pillars.forEach(b => b.classList.toggle('on', b.dataset.p === p)); parts.forEach(x => x.classList.toggle('on', x.dataset.p === p)); };
    let cyc = null; const stop = () => { clearInterval(cyc); cyc = null; };
    pillars.forEach(b => ['mouseenter','focus','click'].forEach(ev => b.addEventListener(ev, () => { stop(); act(b.dataset.p); })));
    parts.forEach(x => ['mouseenter','click'].forEach(ev => x.addEventListener(ev, () => { stop(); act(x.dataset.p); })));
    if (!reduce) { const order = ['2','3','0','1']; let k = 0; cyc = setInterval(() => { k = (k + 1) % 4; act(order[k]); }, 2800); }
  }

  /* ---------- contact form (front end only in this prototype) ---------- */
  const form = $('#contact-form');
  if (form) {
    const pre = new URLSearchParams(location.search).get('type'); if (pre && form.type) form.type.value = pre;
    const check = f => { const el = f.querySelector('input,select,textarea'); let ok = el.checkValidity(); if (el.type === 'email') ok = ok && /.+@.+\..+/.test(el.value); f.classList.toggle('bad', !ok); return ok; };
    $$('.field', form).forEach(f => { const el = f.querySelector('input,select,textarea'); el.addEventListener('input', () => f.classList.contains('bad') && check(f)); });
    form.addEventListener('submit', e => {
      e.preventDefault(); let first = null;
      $$('.field', form).forEach(f => { if (!check(f) && !first) first = f; });
      if (first) { first.querySelector('input,select,textarea').focus(); return; }
      $('#form-ok').classList.add('on'); form.reset(); $('#form-ok').focus();
    });
  }
})();
