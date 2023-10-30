const generateCompositKey = (payload) => {
  const compositeKey = `${payload?.keyFor}-${payload?.firstField.substring(
    0,
    5
  )}-${payload?.secondField}`;
  return compositeKey;
};

exports.compositeKeyGenerator = {
  generateCompositKey,
};
