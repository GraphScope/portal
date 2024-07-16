import hasIntersection from "../utils/public_functions/hasIntersection";

const array1 = [1, 2, 3];
const array2 = [1, 4, 5];

test("array1 and array2 intersection", () => {
  expect(hasIntersection(array1, array2)).toStrictEqual([1]);
});
