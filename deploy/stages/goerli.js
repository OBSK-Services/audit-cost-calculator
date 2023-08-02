const { emptyStage } = require('../helpers');
module.exports = emptyStage('Goerli Deploy stage...');
module.exports.tags = ["goerli"];
module.exports.dependencies = [
  "main_goerli",
  "update_tracer_names"
];
module.exports.runAtTheEnd = true;
