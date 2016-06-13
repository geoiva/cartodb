var CoreView = require('backbone/core-view');

module.exports = CoreView.extend({

  tagName: 'button',

  events: {
    'click': '_onClick'
  },

  initialize: function (opts) {
    if (!opts.rowsCollection) throw new Error('rowsCollection is required');
    if (!opts.tableViewModel) throw new Error('tableViewModel is required');

    this._tableViewModel = opts.tableViewModel;
    this._rowsCollection = opts.rowsCollection;
  },

  render: function () {
    this.$el.html('ANOTHER PAGE!!');
    return this;
  },

  _onClick: function () {
    this._tableViewModel.set('page', this._tableViewModel.get('page') + 1);

    this._rowsCollection.fetch({
      remove: false,
      data: {
        page: this._tableViewModel.get('page')
      }
    });
  }

});