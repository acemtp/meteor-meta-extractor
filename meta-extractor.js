if (Meteor.isClient) {

  // Client side example (async):
  // extractMeta('http://efounders.co', function (err, res) { console.log(err, res); });

  extractMeta = function (params, callback) {
    Meteor.call('extractMeta', params, callback);
  };

}

if (Meteor.isServer) {
  // Server side example (sync):
  // console.log(extractMeta('http://efounders.co'));

  extractMeta = function (params) {
    var html, match;
    var meta = {};

    if(params.substr(0, 4) === 'http') {
      try {
        var result = HTTP.call('GET', params);
        if(result.statusCode !== 200) {
          //console.log('bad status', result);
          return meta;
        }
        html = result.content;
        //console.log('result', result);
      } catch (e) {
        console.log('catch error', e);
        return meta;
      }
    } else {
      html = params;
    }


    // search for a <title>
    var title_regex = /<title>(.*)<\/title>/gmi;
    while ((match = title_regex.exec(html)) !== null) {
      if (match.index === title_regex.lastIndex) {
        title_regex.lastIndex++;
      }
      //console.log('m', m);
      meta.title = match[1];
    }

    // search and parse all <meta>
    var meta_tag_regex = /<meta.*?(?:name|property|http-equiv)=['"]([^'"]*?)['"][\w\W]*?content=['"]([^'"]*?)['"].*?>/gmi;
    while ((match = meta_tag_regex.exec(html)) !== null) {
      if (match.index === meta_tag_regex.lastIndex) {
        meta_tag_regex.lastIndex++;
      }

      if(match[1] === 'description' || match[1] === 'og:description' || match[1] === 'twitter:description') meta.description = match[2];
      if(match[1] === 'og:image' || match[1] === 'twitter:image') meta.image = match[2];
      if(match[1] === 'og:title' || match[1] === 'twitter:title') meta.title = match[2];
      if(match[1] === 'og:url') meta.url = match[2];
    }
    return meta;
  };

  Meteor.methods({
    extractMeta: function (params) {
      check(params, String);
      return extractMeta(params);
    }
  });

}
