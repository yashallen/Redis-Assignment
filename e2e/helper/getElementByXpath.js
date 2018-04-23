exports.command = function (path) {
  const xpath = `document.evaluate('${path}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue`;
  return this.execute(`${xpath}.click()`);
};
