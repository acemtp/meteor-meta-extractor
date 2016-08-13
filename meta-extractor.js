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
          //console.log('bad status', result);
          return META;
        }
        html = result.content;
        //console.log('result', result);
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
      //console.log('m', m);
      META.title = match[1];
    }

    // search and parse all <meta>
    let meta_tag_regex = /<meta.*?(?:name|property|http-equiv)=['"]([^'"]*?)['"][\w\W]*?content=['"]([^'"]*?)['"].*?>/gmi;
    while ((match = meta_tag_regex.exec(html)) !== null) {
      if (match.index === meta_tag_regex.lastIndex) {
        meta_tag_regex.lastIndex++;
      }

      if(match[1] === 'description' || match[1] === 'og:description' || match[1] === 'twitter:description') {
        META.description = he.decode(match[2]);
      }
      if(match[1] === 'og:image' || match[1] === 'twitter:image') {
        META.image = he.decode(match[2]);
      }
      if(match[1] === 'og:title' || match[1] === 'twitter:title') {
        META.title = he.decode(match[2]);
      }
      if(match[1] === 'og:url') {
        META.url = he.decode(match[2]);
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
