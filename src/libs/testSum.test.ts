import sum from './testSum';
test('demo sum', () => {
  expect(sum(2, 2)).toBe(4);
  expect(sum(2, 2)).not.toBe(5);
});
