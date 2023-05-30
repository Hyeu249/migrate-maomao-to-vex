module.exports = {
  SplitSequence: SplitSequence,
};

function SplitSequence(str, arr = [], dir = []) {
  let result = str;

  for (const [i, r] of arr.entries()) {
    const current = result?.split(r);
    if (!(current?.length > 0)) return "";
    result = current[dir[i]];
  }
  return result;
}
