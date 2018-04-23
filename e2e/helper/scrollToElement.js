exports.command = function (path, scrollLimit) {
  this.getLocationInView(path, (result) => {
    const x = result.value.x;
    const y = result.value.y;
    this.execute(`scrollTo(${x},${y})`);
    this.execute(`scrollBy(0,${scrollLimit})`);
  });
  return this;
};
