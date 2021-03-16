export function gb(dateData, key) {
  let keys = [];
  let o = {};
  dateData.forEach((d) => {
    if (!keys.includes(d[key])) {
      keys.push(d[key]);
      o[d[key]] = [d];
    } else {
      o[d[key]].push(d);
    }
  });
  console.log(o);
  return o;
}
