/**
 * componentExists
 *
 * Check whether the given component exist in either the components or containers directory
 */

const fs = require('fs');
const device = process.env.NODE_PLOP_DEVICE;
const pageComponents = fs.readdirSync(`app/${device}/components`);
const pageContainers = fs.readdirSync(`app/${device}/containers`);
const components = pageComponents.concat(pageContainers);

function componentExists(comp) {
  return components.indexOf(comp) >= 0;
}

module.exports = componentExists;
