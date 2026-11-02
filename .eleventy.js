const fs = require('node:fs');
const path = require('node:path');
module.exports = function(eleventyConfig) {
  eleventyConfig.addShortcode('launchChart', require('./lib/launch-charts'));
  eleventyConfig.addWatchTarget('lib/launch-charts.js');
  eleventyConfig.addWatchTarget('industry-map/research/site-publication.json');
  eleventyConfig.addWatchTarget('industry-map/research/site-edition.json');
  eleventyConfig.addWatchTarget('industry-map/research/site-specialties.json');
  // Remove retired public exports even when building into an existing output directory.
  // Source research and internal deliverables remain in industry-map.
  eleventyConfig.on('eleventy.before', ({dir}) => {
    fs.rmSync(path.join(dir.output, 'network/index.html'), {force:true});
    for (const name of ['PharmaTech_Landscape.pdf', 'PharmaTech_Directory.pdf', 'providers.csv', 'landscape.json', 'review-queue.csv']) {
      fs.rmSync(path.join(dir.output, 'assets/map/downloads', name), {force:true});
    }
    for (const id of require('./industry-map/research/site-publication.json').internal_only) {
      fs.rmSync(path.join(dir.output, 'map/companies', id, 'index.html'), {force:true});
    }
  });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "_redirects": "_redirects" });
  eleventyConfig.addWatchTarget("industry-map/scripts/landscape-template.html");
  eleventyConfig.addWatchTarget("industry-map/deliverables/landscape.json");
  eleventyConfig.addWatchTarget("industry-map/assets/logo-manifest.json");
  eleventyConfig.addWatchTarget("industry-map/research/site-editorial.json");
  eleventyConfig.addWatchTarget("industry-map/research/site-ai.json");
  eleventyConfig.addWatchTarget("industry-map/research/site-websites.json");
  eleventyConfig.addWatchTarget("industry-map/research/site-priority.json");
  eleventyConfig.addWatchTarget("lib/atlas.js");
  eleventyConfig.addWatchTarget('lib/profile-schema.js');
  eleventyConfig.addWatchTarget('lib/company-contacts.js');
  eleventyConfig.addWatchTarget('lib/map-locations.js');
  eleventyConfig.addWatchTarget('industry-map/research/site-contacts.json');
  eleventyConfig.addPassthroughCopy({ "industry-map/assets/logos": "assets/map/assets/logos" });
  eleventyConfig.addPassthroughCopy({ "industry-map/deliverables/Pharmaceutical_Logo_Map.pdf": "assets/map/downloads/Pharmatech_Map.pdf" });
  for (const name of ["Pharmatech_Map_2026.jpg"]) {
    eleventyConfig.addPassthroughCopy({ [`industry-map/deliverables/${name}`]: `assets/map/downloads/${name}` });
  }

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
