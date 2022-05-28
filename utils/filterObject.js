/**
 *
 * @param {object} obj
 * @param {string[]} allowFileds
 * @returns obj
 */

module.exports = (obj, allowFileds) => {
  let filteredObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowFileds.includes(key)) filteredObj[key] = obj[key];
  });
  return filteredObj;
};
