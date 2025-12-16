import authService from '../service/AuthService.js';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { comparePassword } from '../utils/hash.js';


// Mock des modules
jest.mock('../models/User.js');
jest.mock('../utils/jwt.js');
jest.mock('../utils/hash.js');

describe('AuthService', () => {

  afterEach(() => {
    jest.clearAllMocks(); // clear mocks après chaque test
  });

  it('should return user data with JWT token when credentials are valid', async () => {
    // Données fictives
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Meriem',
      email: 'meriem@gmail.com',
      password: 'hashedPassword',
      role: 'user'
    };

    // Configurer les mocks
    User.findOne.mockResolvedValue(mockUser);
    comparePassword.mockResolvedValue(true);
    generateToken.mockReturnValue('fake.jwt.token');

    // Appeler login
    const result = await authService.login({
      email: 'meriem@gmail.com',
      password: '123456789'
    });

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith({ email: 'meriem@gmail.com' });
    expect(comparePassword).toHaveBeenCalledWith('123456789', 'hashedPassword');
    expect(generateToken).toHaveBeenCalledWith({
      id: mockUser._id,
      email: mockUser.email,
      role: mockUser.role
    });

    expect(result).toEqual({
      name: 'Meriem',
      email: 'meriem@gmail.com',
      role: 'user',
      jwt: 'fake.jwt.token'
    });
  });
  it('it devrait return user not found', async () => {
    User.findOne.mockResolvedValue(null);

    await expect(
        authService.login({
            email:"meriem@gmail.com",
            password:"123456789"
        })
    ).rejects.toThrow('User not found');     
})
 it('should throw error if password is invalid',async()=>{
    const mockUser={
        id:"507f1f77bcf86cd799439011",
       name:"meriem",
       email:"meriem@gmail.com",
       password:"xxxxxxxxxx",
       role:"user",

    }
    User.findOne.mockResolvedValue(mockUser);
     comparePassword.mockResolvedValue(false);
       await expect(authService.login({email:"meriem@gmail.com",password:"yyyyyyy"})).rejects.toThrow("Invalid password")

 })

});
