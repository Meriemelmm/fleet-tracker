import { comparePassword } from "../utils/hash.js";
import User from '../models/User.js'
import {generateToken} from '../utils/jwt.js'

class AuthService {

    async login(data) {
        const { email, password } = data;

        const user = await User.findOne({email});
 
        if (!user) {
            throw new Error("User not found");
        }

 

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
       const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role
        });

        return {
            name:user.name,
            email:user.email,
            role:user.role,
            jwt:token
        };
    }
}

export default new AuthService();
