if (Meteor.isClient) {
  Session.set('metas', '');

  Template.extract.helpers({
    metas() { return Session.get('metas'); },
  });

  Template.extract.events({
    'keyup #url'(e) {
      if (e.keyCode !== 13) return;
      const url = $('#url').val();
      console.log('extract', url);
      Session.set('metas', 'Extracting ' + url + '...');
      extractMeta(url, (err, res) => {
        if (err) {
          console.error('err while extracting metas', err);
          Session.set('metas', 'Error: ' + err);
        } else {
          Session.set('metas', JSON.stringify(res, null, '  '));
        }
      });
    }
  });
}
