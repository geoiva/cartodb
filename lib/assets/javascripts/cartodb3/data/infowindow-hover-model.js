var InfowindowDefinitionModel = require('./infowindow-definition-model');
var fs = require('fs');

module.exports = InfowindowDefinitionModel.extend({

  defaults: {
    vertical_offset: 0,
    horizontal_offset: 0,
    position: 'top|center'
  },

  TEMPLATES: {
    tooltip_dark: fs.readFileSync(__dirname + '/../mustache-templates/tooltips/tooltip_dark.jst.mustache', 'utf8'),
    tooltip_light: fs.readFileSync(__dirname + '/../mustache-templates/tooltips/tooltip_light.jst.mustache', 'utf8')
  }

});
