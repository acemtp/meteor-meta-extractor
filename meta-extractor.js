"use strict";

if (Meteor.isClient) {

  // Client side example (async):
  // extractMeta('http://efounders.co', function (err, res) { console.log(err, res); });

  extractMeta = function (params, callback) {
    Meteor.call('extractMeta', params, callback);
  };

}

if (Meteor.isServer) {
  let he = Npm.require('he');

  extractMeta = function (params) {
    let html;
    let match;
    const META = {};

    if(params.substr(0, 4) === 'http') {
      try {
        let result = HTTP.call('GET', params);
        if(result.statusCode !== 200) {
          return META;
        }
        html = result.content;
      } catch (e) {
        console.log('catch error', e);
        return META;
      }
    } else {
      html = params;
    }


    // search for a <title>
    let title_regex = /<title>(.*)<\/title>/gmi;
    while ((match = title_regex.exec(html)) !== null) {
      if (match.index === title_regex.lastIndex) {
        title_regex.lastIndex++;
      }
      META.title = match[1];
    }

    // search and parse all <meta>
    let meta_tag_regex = /<meta.*?(?:name|property|http-equiv)=['"]([^'"]*?)['"][\w\W]*?content=['"]([^'"]*?)['"].*?>/gmi;

    let tags = {
      title: ['title', 'og:title', 'twitter:title'],
      description: ['description', 'og:description', 'twitter:description'],
      image: ['image', 'og:image', 'twitter:image'],
      url: ['url', 'og:url', 'twitter:url']
    };

    while ((match = meta_tag_regex.exec(html)) !== null) {
      if (match.index === meta_tag_regex.lastIndex) {
        meta_tag_regex.lastIndex++;
      }

      for (let item in tags) {
        for (let possibleProperty of tags[item]) {

          if (match[1] === possibleProperty) {

            let property = tags[item][0];
            let content = match[2];

            // Only push content to our 'META' object if 'META' doesn't already
            // contain content for that property.
            if (!META[property]) {
              META[property] = he.decode(content);
            }

          }

        }
      }
    }

    return META;
  };

  Meteor.methods({
    extractMeta: function (params) {
      check(params, String);
      return extractMeta(params);
    }
  });

}
