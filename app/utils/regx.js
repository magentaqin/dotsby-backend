const findAnchor = (searchRegx, arr) => {
  return arr.find(item => {
    return item && item.search(searchRegx) !== -1;
  })
}

module.exports = {
  findAnchor,
}