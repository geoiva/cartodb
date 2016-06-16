var Backbone = require('backbone');
var CoreView = require('backbone/core-view');
var TableStats = require('../../../../components/modals/add-widgets/tablestats');
var template = require('./stat.tpl');
var templateCategory = require('./stat-category.tpl');
var templateHistogram = require('./stat-histogram.tpl');
var templateFormula = require('./stat-formula.tpl');

module.exports = CoreView.extend({
  className: 'StatsList is-hidden',
  initialize: function (opts) {
    if (!opts.column) throw new Error('column is required');
    if (!opts.table) throw new Error('table is required');
    if (!opts.type) throw new Error('type is required');
    if (!opts.stat) throw new Error('stat is required');

    this._table = opts.table;
    this._column = opts.column;
    this._type = opts.type;
    this._statType = opts.stat;

    this.model = new Backbone.Model({
      checked: false,
      graph: null
    });

    this._initBinds();
  },

  render: function () {
    this.clearSubViews();
    this.$el.empty();
    this._initViews();
    return this;
  },

  show: function () {
    this.$el.removeClass('is-hidden');
  },

  _initBinds: function () {
    this.model.on('change:checked', this._handleWidget, this);
    this.model.on('change:graph', this._showStat, this);
  },

  _initViews: function () {
    var self = this;
    var ts = new TableStats();
    ts.graphFor(self._table, self._column, function (graph) {
      if (graph.stats) {
        self.model.set({graph: graph});
      }
    });
  },

  _showStat: function () {
    if (this._statType === 'formula') {
      this._showFormula();
    } else if (this._statType === 'histogram') {
      this._showHistogram();
    } else if (this._statType === 'category') {
      this._showCategory();
    }
  },

  _renderTemplate: function () {
    this.$el.append(template({
      column: this._column,
      type: this._type
    }));
  },

  _showFormula: function () {
    var graph = this.model.get('graph');
    var ready = false;
    if (graph.stats && !isNaN(graph.stats.avg) && graph.stats.nulls !== undefined) {
      ready = true;
      this._renderTemplate();
      this.$('.js-stat').append(templateFormula());
      this.$('.js-formula-numbers').text(graph.getNullsPercentage() + '% null');
      this.$('.js-formula-stat').text(graph.getAverage().toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    }

    this.trigger('stat:ready', this, ready);
  },

  _showCategory: function () {
    var graph = this.model.get('graph');
    var ready = false;
    if (graph.stats && graph.stats.freqs) {
      ready = true;
      this._renderTemplate();
      this.$('.js-stat').append(templateCategory());
      this.$('.js-category-stat').append(graph.getCategory({
        color: '#9DE0AD',
        width: 262,
        height: 10
      }));

      this.$('.js-null').text(graph.getNullsPercentage() + '% null');
      this.$('.js-percent').text((graph.getPercentageInTopCategories() * 100).toFixed(2) + '% in top 10 cat.');
    }

    this.trigger('stat:ready', this, ready);
  },

  _showHistogram: function () {
    var graph = this.model.get('graph');
    var ready = false;
    if (graph.stats && graph.stats.nulls != null && graph.stats.histogram_bounds != null) {
      ready = true;
      this._renderTemplate();
      this.$('.js-stat').append(templateHistogram());
      this.$('.js-histogram-stat').append(graph.getHistogram({
        color: '#9DE0AD',
        width: 262,
        height: 20,
        bins: 20
      }));

      this.$('.js-histogram-numbers').text(graph.getNullsPercentage() + '% null');
    }
    this.trigger('stat:ready', this, ready);
  }
});