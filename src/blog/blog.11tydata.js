const defaultDescription = "Ideas from Trust.med on pharmaceutical supply chain connectivity, data exchange, and network operations.";

function postPath(data) {
  return `/blog/${data.slug || data.page.fileSlug}/`;
}

function absoluteUrl(path) {
  if (!path) {
    return undefined;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `https://trust.med${path}`;
}

function toIsoDate(value) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
}

module.exports = {
  layout: "layouts/blog-post.njk",
  tags: "blog",
  pageCss: "/assets/css/blog.css",
  navKey: "blog",
  author: "Trust.med",

  eleventyComputed: {
    permalink: function(data) {
      return postPath(data);
    },

    linkedinShareUrl: function(data) {
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteUrl(postPath(data)))}`;
    },

    seo: function(data) {
      const canonical = postPath(data);
      const description = data.description || defaultDescription;
      const image = absoluteUrl(data.image);

      return {
        title: `${data.title} | Trust.med`,
        description,
        canonical,
        ogTitle: data.title,
        ogDescription: description,
        ogImage: image
      };
    },

    seoSchema: function(data) {
      const canonical = postPath(data);
      const published = toIsoDate(data.date || data.page.date);
      const description = data.description || defaultDescription;

      const article = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": data.title,
        "description": description,
        "url": `https://trust.med${canonical}`,
        "mainEntityOfPage": `https://trust.med${canonical}`,
        "datePublished": published,
        "dateModified": published,
        "image": absoluteUrl(data.image),
        "author": {
          "@type": "Organization",
          "name": data.author || "Trust.med"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Trust.med",
          "logo": {
            "@type": "ImageObject",
            "url": "https://trust.med/assets/img/logo.svg"
          }
        }
      };

      return `<script type="application/ld+json">${JSON.stringify(article).replace(/</g, "\\u003c")}</script>`;
    }
  }
};
