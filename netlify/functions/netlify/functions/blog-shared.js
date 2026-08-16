// Shared header/footer/CSS so blog pages match the rest of the site.
const HEAD_STYLE = `
<style>
  :root{
    --gunmetal: #1b2027; --gunmetal-2: #232a33; --steel: #3e4c59; --steel-light: #7c8ba1;
    --brass: #c9974f; --brass-bright: #e0b567; --off-white: #ede8de; --off-white-dim: #b8b3a6;
    --alert: #b3462f; --line: rgba(237,232,222,0.12); --radius: 3px;
  }
  *{box-sizing:border-box; margin:0; padding:0;}
  html{scroll-behavior:smooth;}
  body{background:var(--gunmetal); color:var(--off-white); font-family:'Source Sans 3', sans-serif; line-height:1.6; -webkit-font-smoothing:antialiased;}
  h1,h2,h3,h4{font-family:'Oswald', sans-serif; text-transform:uppercase; letter-spacing:0.02em; font-weight:600; line-height:1.15;}
  a{color:inherit; text-decoration:none;}
  .wrap{max-width:1120px; margin:0 auto; padding:0 24px;}
  header{position:sticky; top:0; z-index:9999; background:rgba(27,32,39,0.94); backdrop-filter:blur(6px); border-bottom:1px solid var(--line);}
  .nav{display:flex; align-items:center; justify-content:space-between; padding:16px 24px; max-width:1120px; margin:0 auto;}
  .logo{font-family:'Oswald', sans-serif; font-size:1.15rem; letter-spacing:0.03em; text-transform:uppercase; display:flex; align-items:center; gap:10px;}
  .logo .mark{color:var(--brass-bright);}
  .nav-call{display:flex; align-items:center; gap:8px; border:1px solid var(--brass); color:var(--brass-bright); padding:9px 16px; font-family:'JetBrains Mono',monospace; font-size:0.9rem; border-radius:var(--radius);}
  .breadcrumb{font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:var(--steel-light); padding:18px 0 0; max-width:1120px; margin:0 auto; padding-left:24px; padding-right:24px;}
  .breadcrumb a:hover{color:var(--brass-bright);}
  section{padding:48px 0;}
  h1.title{font-size:clamp(1.7rem,4vw,2.4rem); margin:20px 0 12px;}
  .post-meta{font-family:'JetBrains Mono',monospace; font-size:0.8rem; color:var(--steel-light); margin-bottom:28px;}
  .post-body{color:var(--off-white-dim); font-size:1.02rem;}
  .post-body p{margin-bottom:18px;}
  .post-body h2, .post-body h3{color:var(--off-white); margin:28px 0 12px;}
  .post-body img{max-width:100%; height:auto; border-radius:var(--radius); margin:20px 0;}
  .post-body a{color:var(--brass-bright); text-decoration:underline;}
  /* Soro's article HTML can include its own inline positioning/CSS (sticky
     boxes, floating widgets, tables of contents). Lock all of that down so
     it can never escape the article and overlap the header or run off the
     page width. */
  .post-body *{
    position:static !important;
    z-index:auto !important;
    max-width:100% !important;
    float:none !important;
    top:auto !important; left:auto !important; right:auto !important; bottom:auto !important;
  }
  .post-body table{display:block; overflow-x:auto; width:100%;}
  .post-list-item{border-top:1px solid var(--line); padding:26px 0;}
  .post-list-item:first-child{border-top:none;}
  .post-list-item h2{font-size:1.2rem; margin-bottom:8px;}
  .post-list-item p{color:var(--off-white-dim); font-size:0.95rem;}
  .post-list-item .meta{font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:var(--steel-light); margin-top:8px;}
  .strip{background:var(--alert); color:var(--off-white); padding:20px 0;}
  .strip .wrap{max-width:1120px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px;}
  .strip p{font-family:'Oswald',sans-serif; text-transform:uppercase; letter-spacing:0.03em; font-size:1rem;}
  .btn{display:inline-flex; padding:12px 22px; border-radius:var(--radius); font-family:'Oswald', sans-serif; font-weight:600; font-size:0.9rem; letter-spacing:0.04em; text-transform:uppercase; background:var(--gunmetal); color:var(--off-white); border:1px solid rgba(255,255,255,0.3);}
  footer{padding:40px 0; border-top:1px solid var(--line); max-width:1120px; margin:0 auto; padding-left:24px; padding-right:24px;}
  .foot-note{font-size:0.78rem; color:var(--steel-light); font-family:'JetBrains Mono',monospace;}
</style>`;

function headerHtml() {
  return `
<header>
  <div class="nav">
    <div class="logo"><span class="mark">A+</span> Lock &amp; Service</div>
    <a class="nav-call" href="tel:2158289696">(215) 828-9696</a>
  </div>
</header>`;
}

function footerHtml() {
  return `
<div class="strip">
  <div class="wrap" style="max-width:1120px;">
    <p>Locked out right now? We're available 24/7.</p>
    <a class="btn" href="tel:2158289696">Call (215) 828-9696</a>
  </div>
</div>
<footer>
  <div class="foot-note">&copy; ${new Date().getFullYear()} A+ Lock &amp; Service &mdash; Mobile Locksmith, Northeastern Pennsylvania.</div>
</footer>`;
}

function pageWrap({ title, description, bodyHtml, canonicalPath }) {
  const base = "https://www.locallocksmithpros.com";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${base}${canonicalPath}">
<meta name="robots" content="index, follow">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
${HEAD_STYLE}
</head>
<body>
${headerHtml()}
${bodyHtml}
${footerHtml()}
</body>
</html>`;
}

module.exports = { pageWrap };
