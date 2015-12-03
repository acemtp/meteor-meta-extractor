Package.describe({
  name: 'acemtp:meta-extractor',
  version: '1.0.2',
  summary: 'Extract meta tags (opengraph/facebook, twitter, meta) from an url or a string on client & server.',
  git: 'https://github.com/efounders/meteor-meta-extractor',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('0.9.0');
  api.use(['http', 'check'], ['server']);
  api.addFiles('meta-extractor.js');
  api.export('extractMeta');
});
