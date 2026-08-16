// Receives new posts from Soro and stores them in Netlify Blobs.
// Soro's exact field names can vary by plan/config, so this reads several
// common variants defensively and logs the raw payload for debugging.
const { getStore } = require("@netlify/blobs");

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // --- Auth check ---
  const expectedSecret = process.env.SORO_WEBHOOK_SECRET;
  const providedSecret =
    event.headers["x-soro-secret"] ||
    event.headers["x-webhook-secret"] ||
    event.headers["authorization"];

  if (expectedSecret && providedSecret !== expectedSecret && providedSecret !== `Bearer ${expectedSecret}`) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  // Log the raw payload so we can see Soro's real field names on first delivery.
  console.log("Soro webhook payload:", JSON.stringify(payload));

  const title =
    payload.title || payload.headline || payload.name || "Untitled Post";
  const html =
    payload.content_html ||
    payload.contentHtml ||
    payload.html ||
    payload.content ||
    payload.body ||
    "";
  const metaDescription =
    payload.meta_description ||
    payload.metaDescription ||
    payload.excerpt ||
    payload.summary ||
    "";
  const featuredImage =
    payload.featured_image_url ||
    payload.featuredImageUrl ||
    payload.image ||
    payload.imageUrl ||
    "";
  const slug = slugify(payload.slug || title);
  const tags = payload.tags || payload.categories || [];
  const publishedAt = payload.published_at || payload.publishedAt || new Date().toISOString();

  if (!html) {
    return { statusCode: 400, body: "Missing post content in payload" };
  }

  const store = getStore("blog-posts");
  const post = {
    title,
    html,
    metaDescription,
    featuredImage,
    slug,
    tags,
    publishedAt,
  };

  await store.setJSON(slug, post);

  // Maintain an index of all slugs, newest first
  let index = [];
  try {
    index = (await store.get("_index", { type: "json" })) || [];
  } catch (e) {
    index = [];
  }
  index = index.filter((s) => s !== slug);
  index.unshift(slug);
  await store.setJSON("_index", index);

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, slug, url: `/blog/${slug}` }),
  };
};
