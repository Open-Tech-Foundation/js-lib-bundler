function replaceFixedUID(str) {
  const FIXED_UIDS = [
    'e027e0141e62',
    'e47883ab76bb',
    '21825c70e8a0',
    '6353e21f1574',
    '301de81736f4',
    '4f7b8b7dc776',
    '20710112cfd6',
    '37bf896c24d2',
    'c46cf0d7631c',
    'eb70c824aab9',
  ];
  const regexp = new RegExp(/_(?:[^\s]+)_([0-9a-z]{12})/g);
  const matchArr = [...str.matchAll(regexp)];
  const matchedUIDs = matchArr.map((arr) => arr[1]);
  let uidSet;

  if (matchedUIDs) {
    uidSet = new Set(matchedUIDs);
    let count = 0;

    for (let item of uidSet) {
      str = str.replaceAll(item, FIXED_UIDS[count]);
      count++;
    }
  }

  return str;
}

module.exports = replaceFixedUID;
