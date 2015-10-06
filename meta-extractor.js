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
    var html;
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

    // search and parse all <meta>
    var re = /<meta.*(?:name|property)=['"]([^'"]*?)['"].*content=['"]([^'"]*?)['"].*>/gmi;
    while ((m = re.exec(html)) !== null) {
      if (m.index === re.lastIndex) {
          re.lastIndex++;
      }
      //console.log('m', m);
      if(m[1] === 'description' || m[1] === 'og:description' || m[1] === 'twitter:description') meta.description = m[2];
      if(m[1] === 'og:image' || m[1] === 'twitter:image') meta.image = m[2];
      if(m[1] === 'og:title' || m[1] === 'twitter:title') meta.title = m[2];
      if(m[1] === 'og:url') meta.url = m[2];
    }

    // search for a <title>
    re = /<title>(.*)<\/title>/gmi;
    while ((m = re.exec(html)) !== null) {
      if (m.index === re.lastIndex) {
          re.lastIndex++;
      }
      //console.log('m', m);
      meta.title = m[1];
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
