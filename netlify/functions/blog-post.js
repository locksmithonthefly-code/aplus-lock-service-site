const { getStore } = require("@netlify/blobs");
const { pageWrap } = require("./blog-shared");

exports.handler = async (event) => {
  const slug = event.path.replace("/blog/", "").replace(/\/$/, "");
  const store = getStore("blog-posts");

  let post;
  try {
    post = await store.get(slug, { type: "json" });
  } catch (e) {
    post = null;
  }

  if (!post) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: pageWrap({
        title: "Post Not Found | A+ Lock & Service",
        description: "This post could not be found.",
        bodyHtml: `<section><div class="wrap"><h1 class="title">Post Not Found</h1><p><a href="/blog">&larr; Back to Blog</a></p></div></section>`,
        canonicalPath: `/blog/${slug}`,
      }),
    };
  }

  const bodyHtml = `
<div class="wrap breadcrumb" style="max-width:1120px;"><a href="/">Home</a> &rsaquo; <a href="/blog">Blog</a> &rsaquo; ${post.title}</div>
<section>
  <div class="wrap">
    <h1 class="title">${post.title}</h1>
    <div class="post-meta">${new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
    ${post.featuredImage ? `<img src="${post.featuredImage}" alt="${post.title}" style="width:100%; border-radius:3px; margin-bottom:24px;">` : ""}
    <div class="post-body">${post.html}</div>
    <p style="margin-top:36px;"><a href="/blog" style="color:var(--brass-bright);">&larr; Back to all posts</a></p>
  </div>
</section>`;

  const html = pageWrap({
    title: `${post.title} | A+ Lock & Service`,
    description: post.metaDescription || post.title,
    bodyHtml,
    canonicalPath: `/blog/${slug}`,
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
    body: html,
  };
};
