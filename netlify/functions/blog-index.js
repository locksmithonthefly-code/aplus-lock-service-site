const { getStore } = require("@netlify/blobs");
const { pageWrap } = require("./blog-shared");

exports.handler = async () => {
  const store = getStore({
    name: "blog-posts",
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_BLOBS_TOKEN,
  });
  let index = [];
  try {
    index = (await store.get("_index", { type: "json" })) || [];
  } catch (e) {
    index = [];
  }

  const posts = [];
  for (const slug of index) {
    try {
      const post = await store.get(slug, { type: "json" });
      if (post) posts.push(post);
    } catch (e) {}
  }

  const listHtml = posts.length
    ? posts
        .map(
          (p) => `
    <div class="post-list-item">
      <h2><a href="/blog/${p.slug}">${p.title}</a></h2>
      <p>${p.metaDescription || ""}</p>
      <div class="meta">${new Date(p.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
    </div>`
        )
        .join("\n")
    : `<p style="color:var(--off-white-dim);">No posts yet — check back soon.</p>`;

  const bodyHtml = `
<div class="wrap breadcrumb" style="max-width:1120px;"><a href="/">Home</a> &rsaquo; Blog</div>
<section>
  <div class="wrap">
    <h1 class="title">Locksmith Tips &amp; News</h1>
    <p style="color:var(--off-white-dim); margin-bottom:20px;">Advice and updates from A+ Lock &amp; Service, serving Northeastern Pennsylvania.</p>
    ${listHtml}
  </div>
</section>`;

  const html = pageWrap({
    title: "Blog | A+ Lock & Service",
    description: "Locksmith tips, news, and advice from A+ Lock & Service, serving Northeastern Pennsylvania.",
    bodyHtml,
    canonicalPath: "/blog",
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
    body: html,
  };
};
