const commonConfig = require("../webpack.common.config");
const version = require("./package.json").version;

const banner = `Author : Matteo Bruni - https://www.matteobruni.it
MIT license: https://opensource.org/licenses/MIT
Demo / Generator : https://particles.js.org/
GitHub : https://www.github.com/matteobruni/tsparticles
How to use? : Check the GitHub README
v${version}`;

const minBanner = `tsParticles Bouncing Preset v${version} by Matteo Bruni`;

module.exports = [
    commonConfig.getConfig(commonConfig.getEntry("bouncing", banner, minBanner))
];
