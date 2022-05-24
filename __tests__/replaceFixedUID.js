function replaceFixedUID(str) {
  const FIXED_UIDS = [
    'e027e0141e62',
    'e47883ab76bb',
    '21825c70e8a0',
    '6353e21f1574',
  ];

  console.log(str);

  const matchedUIDs = new RegExp(/_(?:.*)_([0-9a-z]{12})/).exec(str);
  let uidSet;
  if (matchedUIDs) {
    uidSet = new Set(matchedUIDs.slice(1));
    console.log(uidSet);
  }

  let count = 0;

  for (let item of uidSet) {
    str = str.replaceAll(item, FIXED_UIDS[count]);
    count++;
  }

  return str;
}

module.exports = replaceFixedUID;
