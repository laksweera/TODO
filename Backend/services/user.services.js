import userRepo from "../repositories/user.repo.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from "../models/model.js";

const userService = {

  validatorEmail: (email) => {
    return validator.isEmail(email);
  },
  validatorPassword: (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
    return passwordRegex.test(password);
  },
  //user registration 
  registerUser: async (email, password, firstName, lastName, points, notificationToken) => {
    try {
        const existingUser = await userRepo.getUserByEmail(email);
        if (existingUser) {
            return {
                status: false,
                message: 'User with this email already exists!'
            };
        }

        if (!userService.validatorEmail(email)) {
            return {
                status: false,
                message: "Email is invalid!"
            };
        }

        if (!userService.validatorPassword(password)) {
            return {
                status: false,
                message: "Password must be strong and length should be 8 to 10 characters!"
            };
        }

        const result = await userRepo.registerUser(email, password, firstName, lastName, points, notificationToken);
        if (result) {
            // Token generated for registration
            const user = await userRepo.getUserByEmail(email);
            const token = jwt.sign(
                { userId: user.id ,},
                process.env.SECRET,
                { expiresIn: 259200 }
            );
            return {
                status: true,
                message: 'User registered successfully',
                token: token,
                userId: user.id 
            };
        }

    } catch (error) {
        throw error;
    }
},


  //user login
  userLogin: async (email, password, notificationToken) => {
    try {
      const user = await userRepo.getUserByEmailForLogin(email, notificationToken);
      if (!user) {
        return {
          status: false,
          message: 'User data not found!',
        };
      }
    
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return {
          status: false,
          message: 'Incorrect password!',
        };
      } else {
        //token generated for login
        if (user) {
          const token = jwt.sign(
            { userId: user.id },
            process.env.SECRET,
            { expiresIn: 259200 }
          )


          return {
            status: true,
            message: 'Login Successfully!',
            token: token,
            user: user
          };
        } else {
          return {
            status: false,
            message: 'Token generate error',
          }
        }

      }
    } catch (error) {
      throw error;
    }
  },

  //update user 

  updateUser: async (userId, email, password, firstName, lastName, image, points, notificationToken) => {
    try {
      const updatedUser = await userRepo.updateUser(userId, email, password, firstName, lastName, image, points, notificationToken);
      if (updatedUser) {
        return {
          status: true,
          message: "User updated successfully",
          updatedUser
        }
      } else {
        return {
          status: false,
          message: "User not updated",
        }
      }
    } catch (error) {
      throw error;

    }
  },

  //get user by id
  getUserById: async (userId) => {
    try {
      const user = await userRepo.getUserById(userId);
      return user;
    } catch (error) {
      throw error;
    }
  },

  //delete user by id
  deleteUserById: async (userId) => {
    try {
      const result = await userRepo.deleteUserById(userId);
      return result > 0;
    } catch (error) {
      throw error;
    }
  },

  //get all users
  getAllUsersForUser: async () => {
    try {
      const allUsers = await userRepo.getAllUsers();
      return allUsers;
    } catch (error) {
      throw error;
    }
  },
  //get all users for admin


  //userPasswordChange
  changeUserPassword: async (userId, oldPassword, newPassword) => {
    try {
      // get super user
      const User = await userRepo.getUserById(userId);
      if (!User) {
        return {
          status: false,
          message: "User not found!",
        };
      }
      // checking current password
      const passwordMatch = await bcrypt.compare(
        oldPassword,
        User.password
      );
      if (!passwordMatch) {
        return {
          status: false,
          message: "Incorrect old password!",
        };
      }
      // hash new password using bcrypt algorithm
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      console.log(newPassword);
      const result = await userRepo.changeUserPassword(
        userId,
        newPasswordHash
      );
      if (!result) {
        return {
          status: false,
          message: "User update failed!",
        };
      } else {
        return {
          status: true,
          message: "User updated successfully!",
        };
      }
    } catch (error) {
      throw error;
    }
  },


  //send the reset password email
  generateAndSendOTP: async (email) => {
    try {
      const user = await userRepo.getUserByEmail(email);

      if (!user) {
        throw new Error('Invalid user or email address');
      }
      const userId = user.id; // Retrieve the userId from the user object
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
      const otpExpiryTime = new Date(Date.now() + 10 * 60 * 1000);

      await userRepo.storeOTP(userId, otp, otpExpiryTime);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_PASS,
        },
      });

      const mailOptions = {
        from: process.env.USER_EMAIL,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}. This code will expire in 10 minutes.`,
      }
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;

    }
  },

  validateOTP: async (userId, enteredOTP) => {
    try {
      const storedOTP = await userRepo.getStroedOTP(userId);

      if (storedOTP && storedOTP.otp == enteredOTP && new Date() < storedOTP.expiryTime) {
        return true;
      }
      return false;
    } catch (error) {
      throw error;

    }
  },

  changeUserPasswordWithOTP: async (userId, newPassword, enteredOTP) => {
    try {
      const isOTPValid = await userService.validateOTP(userId, enteredOTP);
      if (!isOTPValid) {
        return {
          status: false,
          message: "Otp is invalid!",
        };
      }
      if (isOTPValid) {
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const result = await userRepo.changeUserPassword(userId, hashedNewPassword);
        await userRepo.clearStoredOTP(userId);
        return result;
      }
    } catch (error) {
      throw error;
    }
  }
}

export default userService;
