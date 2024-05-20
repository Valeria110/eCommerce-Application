import { isNull } from './utils';

describe('isNull', () => {
  it('should not throw an error when the element is not null', () => {
    const testElement = 'not null';

    expect(() => isNull(testElement)).not.toThrow();
  });

  it('should throw an error when the element is null', () => {
    const testElement = null;

    expect(() => isNull(testElement)).toThrow('null is null');
  });
});
