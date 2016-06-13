var CoreView = require('backbone/core-view');
var TableViewModel = require('./table-view-model.js');
var TableHeadView = require('./head/table-head-view');
var TableBodyView = require('./body/table-body-view');
var Notifier = require('../../editor/components/notifier/notifier');
var errorParser = require('../../helpers/error-parser');

/*
 *  Main table view
 */

module.exports = CoreView.extend({

  options: {
    readonly: false
  },

  className: 'Table',
  tagName: 'div',

  events: {
    'click .js-addColumn': 'addColumn',
    'click .js-addRow': 'addRow'
  },

  initialize: function (opts) {
    if (!opts.querySchemaModel) throw new Error('querySchemaModel is required');
    if (!opts.columnsCollection) throw new Error('columnsCollection is required');
    if (!opts.rowsCollection) throw new Error('rowsCollection is required');

    this.rowsCollection = opts.rowsCollection;
    this.columnsCollection = opts.columnsCollection;
    this._querySchemaModel = opts.querySchemaModel;

    this.tableViewModel = new TableViewModel({
      readonly: opts.readonly,
      tableName: opts.tableName
    }, {
      querySchemaModel: this._querySchemaModel
    });

    if (this._querySchemaModel.get('status') === 'unfetched') {
      this._querySchemaModel.fetch();
    }

    this._initBinds();
  },

  render: function () {
    this.clearSubViews();
    this.$el.empty();
    this._initViews();
    return this;
  },

  _initBinds: function () {
    this._querySchemaModel.bind('change:query', this._onQueryChanged, this);
    this.add_related_model(this._querySchemaModel);
  },

  _initViews: function () {
    var tableHeadView = new TableHeadView({
      querySchemaModel: this._querySchemaModel,
      columnsCollection: this.columnsCollection,
      tableViewModel: this.tableViewModel
    });

    this.addView(tableHeadView);
    this.$el.append(tableHeadView.render().el);

    var tableBodyView = new TableBodyView({
      columnsCollection: this.columnsCollection,
      rowsCollection: this.rowsCollection,
      querySchemaModel: this._querySchemaModel,
      tableViewModel: this.tableViewModel
    });

    this.addView(tableBodyView);
    this.$el.append(tableBodyView.render().el);
  },

  addRow: function () {
    if (!this.tableViewModel.isDisabled()) {
      var notification = Notifier.addNotification({
        status: 'loading',
        info: _t('components.table.rows.create.loading'),
        closable: false
      });

      notification.on('notification:close', function () {
        Notifier.removeNotification(notification);
      });

      this.rowsCollection.addRow({
        success: function (mdl, attrs) {
          notification.set({
            status: 'success',
            info: _t('components.table.rows.create.success', { column_name: attrs.name }),
            closable: true
          });
        },
        error: function (mdl, e) {
          notification.set({
            status: 'error',
            info: _t('components.table.rows.create.error', { error: errorParser(e) }),
            closable: true
          });
        }
      });
    }
  },

  addColumn: function () {
    if (!this.tableViewModel.isDisabled()) {
      var notification = Notifier.addNotification({
        status: 'loading',
        info: _t('components.table.columns.create.loading'),
        closable: false
      });

      notification.on('notification:close', function () {
        Notifier.removeNotification(notification);
      });

      this.columnsCollection.addColumn({
        success: function (mdl, attrs) {
          notification.set({
            status: 'success',
            info: _t('components.table.columns.create.success', { column_name: attrs.name }),
            closable: true
          });
        },
        error: function (mdl, e) {
          notification.set({
            status: 'error',
            info: _t('components.table.columns.create.success', { error: errorParser(e) }),
            closable: true
          });
        }
      });
    }
  },

  _onQueryChanged: function () {
    this.tableViewModel.resetFetchDefaults();
  }

});