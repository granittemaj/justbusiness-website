// Reusable dotted globe. Needs d3 and topojson-client on the page.
// JBGlobe(canvas, {places, hub, tip, rotate, autoRotate, onHover}) -> {focus(i), hover(i)}
(function(){
  const COL = {nfs:'#F5821F', jb:'#32E3F7', hub:'#FFFFFF'};
  const CACHE = 'jb-land-dots-v1';
  let landPromise = null;

  // land as a field of dots; computed once, then cached for the session
  function landDots(){
    if (landPromise) return landPromise;
    landPromise = (async () => {
      try { const c = sessionStorage.getItem(CACHE); if (c) { const f = JSON.parse(c), out = []; for (let i = 0; i < f.length; i += 2) out.push([f[i], f[i + 1]]); return out; } } catch (e) {}
      const world = await (await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json')).json();
      // rasterise the land once on a hidden equirectangular canvas, then sample pixels: milliseconds, not seconds
      const land = topojson.feature(world, world.objects.land), out = [];
      const MW = 1440, MH = 720, mc = document.createElement('canvas'); mc.width = MW; mc.height = MH;
      const mx = mc.getContext('2d', {willReadFrequently:true});
      const eq = d3.geoEquirectangular().scale(MW / (2 * Math.PI)).translate([MW / 2, MH / 2]);
      mx.fillStyle = '#fff'; mx.beginPath(); d3.geoPath(eq, mx)(land); mx.fill();
      const px = mx.getImageData(0, 0, MW, MH).data;
      for (let lat = -58; lat <= 80; lat += 1.7) {
        const step = 1.7 / Math.max(.2, Math.cos(lat * Math.PI / 180));
        for (let lon = -180; lon < 180; lon += step) {
          const x = Math.min(MW - 1, Math.floor((lon + 180) / 360 * MW)), y = Math.min(MH - 1, Math.floor((90 - lat) / 180 * MH));
          if (px[(y * MW + x) * 4 + 3] > 128) out.push([+lon.toFixed(2), +lat.toFixed(2)]);
        }
      }
      try { sessionStorage.setItem(CACHE, JSON.stringify(out.flat())); } catch (e) {}
      return out;
    })();
    return landPromise;
  }

  window.JBGlobe = function(canvas, opts){
    const o = Object.assign({places:[], hub:null, tip:null, rotate:[100, -18], autoRotate:true, scale:.42, arcs:true, onHover:null}, opts);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    const proj = d3.geoOrthographic().clipAngle(90).precision(.5), path = d3.geoPath(proj, ctx), grat = d3.geoGraticule10();
    let W = 0, R = 0, rot = [o.rotate[0], o.rotate[1], 0], target = null, dragging = false, hover = -1, dots = [], running = true, last = null;
    const arcs = o.hub && o.arcs ? o.places.map(p => ({p, f:d3.geoInterpolate(o.hub.at, p.at), off:Math.random()})) : [];

    function size(){ const dpr = Math.min(devicePixelRatio || 1, 2); W = canvas.clientWidth; canvas.width = canvas.height = W * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); R = W * o.scale; proj.scale(R).translate([W / 2, W / 2]); }
    size(); addEventListener('resize', size);
    landDots().then(d => { dots = d; }).catch(e => console.warn('Globe land data unavailable', e));

    const visible = ll => d3.geoDistance(ll, [-rot[0], -rot[1]]) < Math.PI / 2 - .02;
    const lifted = (ll, s) => { const p = proj(ll), k = 1 + Math.sin(Math.PI * s) * .1; return [W / 2 + (p[0] - W / 2) * k, W / 2 + (p[1] - W / 2) * k]; };

    function draw(t){
      ctx.clearRect(0, 0, W, W);
      const g = ctx.createRadialGradient(W / 2, W / 2, R * .7, W / 2, W / 2, R * 1.25);
      g.addColorStop(0, 'rgba(50,227,247,.18)'); g.addColorStop(.5, 'rgba(50,227,247,.05)'); g.addColorStop(1, 'rgba(50,227,247,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(W / 2, W / 2, R * 1.25, 0, 7); ctx.fill();
      const s = ctx.createRadialGradient(W * .4, W * .35, R * .1, W / 2, W / 2, R);
      s.addColorStop(0, '#0E3470'); s.addColorStop(1, '#04112A');
      ctx.fillStyle = s; ctx.beginPath(); path({type:'Sphere'}); ctx.fill();
      ctx.strokeStyle = 'rgba(143,241,251,.07)'; ctx.lineWidth = .6; ctx.beginPath(); path(grat); ctx.stroke();
      ctx.fillStyle = 'rgba(200,225,250,.58)';
      for (const d of dots) { if (!visible(d)) continue; const p = proj(d); ctx.fillRect(p[0] - .9, p[1] - .9, 1.8, 1.8); }
      arcs.forEach((a, i) => {
        const col = COL[a.p.k], hl = hover === i;
        ctx.beginPath(); let on = false;
        for (let k = 0; k <= 1.0001; k += .025) { const ll = a.f(k); if (!visible(ll)) { on = false; continue; } const p = lifted(ll, k); on ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); on = true; }
        ctx.strokeStyle = col; ctx.globalAlpha = hl ? .95 : .35; ctx.lineWidth = hl ? 1.8 : 1; ctx.stroke(); ctx.globalAlpha = 1;
        const k = ((t / 2600) + a.off) % 1, ll = a.f(k);
        if (visible(ll)) { const p = lifted(ll, k); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(p[0], p[1], 2.2, 0, 7); ctx.fill(); ctx.shadowBlur = 0; }
      });
      const marks = o.hub ? [o.hub, ...o.places] : o.places, offset = o.hub ? 1 : 0;
      marks.forEach((m, j) => {
        if (!visible(m.at)) return; const p = proj(m.at), col = COL[m.k], hl = hover === j - offset, pulse = (t / 1600 + j * .13) % 1;
        ctx.strokeStyle = col; ctx.globalAlpha = (1 - pulse) * .8; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(p[0], p[1], 4 + pulse * 14, 0, 7); ctx.stroke(); ctx.globalAlpha = 1;
        ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = hl ? 20 : 10; ctx.beginPath(); ctx.arc(p[0], p[1], m.k === 'hub' ? 4.5 : hl ? 5.5 : 3.6, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      });
    }

    function frame(t){
      if (running) {
        if (target) { rot[0] += (target[0] - rot[0]) * .06; rot[1] += (target[1] - rot[1]) * .06; if (Math.abs(target[0] - rot[0]) < .1 && Math.abs(target[1] - rot[1]) < .1) target = null; }
        else if (!dragging && o.autoRotate && !reduce) rot[0] += .08;
        proj.rotate(rot); draw(t);
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    new IntersectionObserver(es => { running = es[0].isIntersecting; }).observe(canvas);

    function setHover(i){
      hover = i;
      if (o.tip) {
        if (i >= 0 && visible(o.places[i].at)) { const m = o.places[i], p = proj(m.at); o.tip.innerHTML = `<b>${m.name}</b><span>${m.k === 'nfs' ? 'Not For Sale · ' : 'Venture · '}${m.note}</span>`; o.tip.style.left = (p[0] / W * 100) + '%'; o.tip.style.top = (p[1] / W * 100) + '%'; o.tip.style.opacity = 1; }
        else o.tip.style.opacity = 0;
      }
      if (o.onHover) o.onHover(i);
    }
    function focus(i){ const m = o.places[i]; if (!m) return; target = [-m.at[0], Math.max(-50, Math.min(50, -m.at[1] * .7))]; hover = i; setTimeout(() => setHover(i), 650); }

    canvas.addEventListener('pointerdown', e => { dragging = true; target = null; last = [e.clientX, e.clientY]; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (dragging && last) { rot[0] += (e.clientX - last[0]) * .3; rot[1] = Math.max(-50, Math.min(50, rot[1] - (e.clientY - last[1]) * .3)); last = [e.clientX, e.clientY]; return; }
      let f = -1; o.places.forEach((m, i) => { if (!visible(m.at)) return; const p = proj(m.at); if (Math.hypot(p[0] - x, p[1] - y) < 12) f = i; });
      if (f !== hover) setHover(f);
      canvas.style.cursor = f >= 0 ? 'pointer' : 'grab';
    });
    canvas.addEventListener('click', () => { const m = o.places[hover]; if (m && m.slug) location.href = 'venture.html?v=' + m.slug; });
    addEventListener('pointerup', () => { dragging = false; last = null; });
    canvas.addEventListener('pointerleave', () => setHover(-1));

    return {focus, hover:setHover};
  };
})();
