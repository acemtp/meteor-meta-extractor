meteor-meta-extractor
=====================

Extract meta tags (opengraph / facebook, twitter, meta) from a html string or an url. Work on client and server.

Install
-------
```
meteor add acemtp:meta-extractor
```

Usage
-----

This package is almost isomorphic. It has only one function `extractMeta()` that returns an object containing, if found a `title`, `description`, `image`, `url`.

**On the client**, the function does a `Meteor.call()` because only the server can get the content of the url. It's async because there's no fiber on the client. So you have to pass a callback to get the answer:

    extractMeta('http://efounders.co', function (err, res) { console.log(res); });

**On the server**, the function is sync and returns the meta object:

    console.log(extractMeta('http://efounders.co'));

Both example will display something like:

    {
      description: 'eFounders is a startup Studio. Together with entrepreneurs, we turn unique ideas into successful companies. We act as the perfect co-founder to build strong and independent startups. ',
      title: 'eFounders • Startup Studio',
      image: 'http://efounders.co/public/images/630_homepage.jpg',
      url: 'http://efounders.co/'
    }

Example
-------

Go to `example` directory and run meteor inside it. You can try the example here: http://meta-extractor.meteor.com
