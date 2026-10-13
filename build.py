# Stamps the shared head, header and footer onto each page in src/ and writes it to the site root.
import pathlib, re
ROOT = pathlib.Path(__file__).parent
LOGO = "https://images.squarespace-cdn.com/content/v1/6166afef1df8aa4f96022572/d63fb476-99c6-4d17-8880-3949dc016d4d/JUSTBUSINESS+LOGO+%28WHITE%29.png?format=500w"
NAV = [("ventures.html","Ventures","ventures"),("approach.html","Approach","approach"),("not-for-sale.html","Not For Sale","nfs"),("about.html","About","about"),("news.html","News","news"),("contact.html","Contact","contact")]

HEAD = """<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-52 -52 104 104'%3E%3Crect x='-52' y='-52' width='104' height='104' rx='20' fill='%23021F4C'/%3E%3Cg transform='rotate(45) scale(.8)' fill='%2332E3F7'%3E%3Cpath d='M4 4H52V18H18V52H4Z'/%3E%3Cpath transform='rotate(90)' d='M4 4H52V18H18V52H4Z'/%3E%3Cpath transform='rotate(180)' d='M4 4H52V18H18V52H4Z'/%3E%3Cpath transform='rotate(270)' d='M4 4H52V18H18V52H4Z'/%3E%3C/g%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/site.css">"""

SPRITE = """<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <symbol id="x" viewBox="-52 -52 104 104"><g transform="rotate(45)"><path d="M4 4H52V18H18V52H4Z"/><path transform="rotate(90)" d="M4 4H52V18H18V52H4Z"/><path transform="rotate(180)" d="M4 4H52V18H18V52H4Z"/><path transform="rotate(270)" d="M4 4H52V18H18V52H4Z"/></g></symbol>
  <symbol id="ar" viewBox="0 0 16 16"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="ne" viewBox="0 0 16 16"><path d="M4 12L12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <linearGradient id="og" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F5821F"/><stop offset="1" stop-color="#32E3F7"/></linearGradient>
</defs></svg>"""

def header(active):
    cur = lambda k: ' aria-current="page"' if k == active else ''
    links = "".join(f'<li><a href="{h}"{cur(k)}>{t}</a></li>' for h, t, k in NAV)
    sheet = "".join(f'<li><a href="{h}"{cur(k)}>{t}<span>0{i+1}</span></a></li>' for i, (h, t, k) in enumerate(NAV))
    return f"""<a class="skip" href="#main">Skip to content</a>
{SPRITE}
<header class="nav"><div class="wrap">
  <a class="logo" href="index.html" aria-label="Just Business, home"><img src="{LOGO}" alt="Just Business" width="131" height="20"></a>
  <nav aria-label="Primary"><ul>{links}</ul></nav>
  <div class="acts"><a class="btn btn-line btn-sm" href="https://wearenotforsale.org/" rel="noopener">Support Not For Sale</a><a class="btn btn-cy btn-sm" href="contact.html">Contact us</a><button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="sheet"><i></i></button></div>
</div></header>
<div class="sheet" id="sheet" aria-hidden="true"><ul>{sheet}</ul><div class="acts"><a class="btn btn-cy" href="contact.html">Contact us</a><a class="btn btn-or" href="https://wearenotforsale.org/" rel="noopener">Support Not For Sale</a></div></div>"""

FOOTER = f"""<footer class="foot"><div class="wrap">
  <div class="foot-g">
    <div><a class="logo" href="index.html"><img src="{LOGO}" alt="Just Business" width="144" height="22" loading="lazy"></a><p>Scaling business with social impact. Investing in and building profitable ventures since 2006.</p><a class="partner" href="not-for-sale.html"><b>Not For Sale</b> Our founding partner</a></div>
    <div><h4>Explore</h4><ul><li><a href="ventures.html">Ventures</a></li><li><a href="approach.html">Approach</a></li><li><a href="not-for-sale.html">Not For Sale</a></li></ul></div>
    <div><h4>Company</h4><ul><li><a href="about.html">About</a></li><li><a href="about.html#team">Team</a></li><li><a href="news.html">News</a></li></ul></div>
    <div><h4>Connect</h4><ul><li><a href="contact.html">Contact</a></li><li><a href="https://www.linkedin.com/company/just-business-inc" rel="noopener">LinkedIn</a></li><li><a href="https://wearenotforsale.org/" rel="noopener">wearenotforsale.org</a></li></ul></div>
  </div>
  <div class="foot-b"><span>© 2026 Just Business, Inc.</span><span>Concept site · venture photography via Unsplash, to be replaced</span></div>
</div></footer>
<a class="totop" id="totop" href="#main" aria-label="Back to top"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>"""

SCRIPTS = '<script src="assets/data.js"></script>\n<script src="assets/site.js"></script>'
GLOBE = '<script src="https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js"></script>\n<script src="https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js"></script>\n<script src="assets/globe.js"></script>'

for src in sorted((ROOT / "src").glob("*.html")):
    s = src.read_text()
    active = re.search(r"<!--page:(\w+)-->", s).group(1)
    s = (s.replace("{{HEAD}}", HEAD).replace("{{HEADER}}", header(active)).replace("{{FOOTER}}", FOOTER)
          .replace("{{SCRIPTS}}", SCRIPTS).replace("{{GLOBE}}", GLOBE))
    assert "{{" not in s, src.name
    (ROOT / src.name).write_text(s)
    print("built", src.name, len(s))
