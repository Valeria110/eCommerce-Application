import { routes, handleLocation, isUserLogined, retrieveProductId } from './routing';

jest.mock('../requestsAPI', () => ({
  isLogined: false,
  customerData: {
    firstName: 'Jon',
    lastName: 'Smit',
    email: 'test@test.com',
  },
}));

describe('changePageRoute function', () => {
  it('should contain the product route', () => {
    expect(routes).toContain('/product');
  });
  it('should contain the login route', () => {
    expect(routes).toContain('/login');
  });
  it('should contain the main route', () => {
    expect(routes).toContain('/main');
  });
  it('should contain the sign_up route', () => {
    expect(routes).toContain('/sign_up');
  });
  it('should contain the catalog route', () => {
    expect(routes).toContain('/catalog');
  });
  it('should contain the about_us route', () => {
    expect(routes).toContain('/about_us');
  });
  it('should contain the user_profile_page route', () => {
    expect(routes).toContain('/user_profile_page');
  });
});

describe('handleLocation function', () => {
  it('shooul not return any value', () => {
    expect(handleLocation()).toBeUndefined();
  });
});

describe('isUserLogined function', () => {
  it('should return false if a user is not logged in', () => {
    expect(isUserLogined()).toBeFalsy();
  });
});

describe('retrieveProductId function', () => {
  it('should return product id', () => {
    const pathname = '/product-123456789fgrjdfv879834kjnf';
    expect(retrieveProductId(pathname)).toEqual('123456789fgrjdfv879834kjnf');
  });
});
