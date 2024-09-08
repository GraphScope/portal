export function isArrayExist<T>(item: T, arrary: Array<T>): boolean {
  return arrary.indexOf(item) !== -1;
}

export function getSequentialLetter(): () => string {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  let index = 0;

  return function () {
    if (index >= letters.length) {
      throw new Error('No more letters to choose from');
    }

    const letter = letters[index];
    index++; // Move to the next letter in sequence
    return letter;
  };
}
