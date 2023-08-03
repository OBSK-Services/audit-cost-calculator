require("@nomicfoundation/hardhat-toolbox");
require("./tasks/CostCalculation")(task);
require("./tasks/RetrievalOfAllArtifacts")(task);

module.exports = {
    solidity: "0.8.15"
};
