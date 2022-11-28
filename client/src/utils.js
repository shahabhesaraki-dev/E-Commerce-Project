export const getRandomKey = () => {
  const KEY_LENGTH = 10;
  let newKey = ``;
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-";
  for (let i = 0; i < KEY_LENGTH; i++) {
    newKey += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return newKey;
};
