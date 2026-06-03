module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  eleventyConfig.addFilter("readableDate", function(dateObj) {
    const date = dateObj instanceof Date ? dateObj : new Date(dateObj);

    return new Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(date);
  });

  eleventyConfig.addFilter("htmlDateString", function(dateObj) {
    const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
    return date.toISOString().split("T")[0];
  });

  eleventyConfig.addCollection("blogPosts", function(collectionApi) {
    return collectionApi.getFilteredByTag("blog").sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
  };
};