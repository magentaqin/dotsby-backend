const compareVersion = (a, b) => {
  let isFirstLarger = false;
  const aVersions = a.split('.').map(item => Number.parseInt(item));
  const bVersions = b.split('.').map(item => Number.parseInt(item));
  aVersions.some((val, index) => {
    if (val > bVersions[index]) {
      isFirstLarger = true;
      return true;
    }
    return false;
  })
  if (isFirstLarger) {
    return 1;
  }
  return -1;
}

module.exports = {
  compareVersion,
}