import { User } from './sign-up.dto';

describe('User', () => {
  it('should be defined', () => {
    expect(new User()).toBeDefined();
  });
});
