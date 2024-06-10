import userService from "../services/user.services.js";

const userController = {

  registerUser: async (req, res) => {
    try {
        const { email, password, firstName, lastName,  } = req.body;

        const result = await userService.registerUser(email, password, firstName, lastName);

        if (result.status) {
            // Status is true, so registration is successful
            res.status(200).json({
                response_code: 200,
                success: true,
                message: result.message,
                user: { userId: result.userId, firstName, lastName, email },
                 token: result.token
            });
        } else {
            // Status is false, there is an error
            res.status(400).json({
                response_code: 400,
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            response_code: 500,
            error: error,
            success: false,
            message: 'Error occurred while registering user'
        });
    }
},

  userLogin: async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await userService.userLogin(email, password);
      console.log(result);
      if (result.status) {
        // Status is true, so registration is successful
        res.status(200).json({
            response_code: 200,
            success: true,
            message: result.message,
            token: result.token,
            userId : result.user.id, 
            firstName:result.user.firstName,
            lastName:result.user.lastName
        });
    } else {
        // Status is false, there is an error
        res.status(400).json({
            response_code: 400,
            success: false,
            message: result.message
        });
    }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        error: 'Error occurred'
      });
    }
  },

  deleteUser: async (req, res) => {
    const userId = req.params.id;

    try {
      const isUserDelete = await userService.deleteUserById(userId);

      if (isUserDelete) {
        res.status(200).json({
          response_code: 200,
          success: true, message: 'User deleted successfully'
        });
      } else {
        res.status(404).json({
          response_code: 404,
          success: false, message: 'User not found'
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        success: false, message: 'Error occurred while deleting user'
      });

    }
  },

  getUserById: async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await userService.getUserById(userId);
      if (!user) {
        res.status(404).json({ response_code: 404, success: false, message: 'User not found' });
        return;
      }
      res.status(200).json({
        response_code: 200,
        success: true, user
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        success: false, message: 'Error occurred while fetching user'
      });
    }
  },

  

  changeUserPassword: async (req, res) => {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;
    try {
      const result = await userService.changeUserPassword(
        userId,
        oldPassword,
        newPassword
      );
      res.status(200).json({
        response_code: 200,
        result
      });
    } catch (error) {
      res.status(500).json({
        response_code: 500,
        error: "Error occurred!"
      });
    }
  },

  updateUser: async (req, res) => {
    const { userId, email, firstName, lastName, points } = req.body;

  
    // Check if file is provided in the form data
    if (req.file) {
      try {
        // Upload image to Cloudinary
        // Extract secure URL of the uploaded image from Cloudinary response
      } catch (error) {
        return res.status(500).json({
          response_code: 500,
          status: false,
          error: "Error uploading image to database"
        });
      }
    }
    
    try {
      const result = await userService.updateUser(userId, email, firstName, lastName);
     
      if (result) {
        res.status(200).json({
          response_code: 200,
          result
        })
      } else {
        res.status(400).json({
          response_code: 400,
          result
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      })
    }
  },
  
  sendOTP: async (req, res) => {
    const { email } = req.body;
    try {
      await userService.generateAndSendOTP(email);
      res.status(200).json({
        response_code: 200,
        success: true, message: 'OTP sent successfully.'
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        error: 'Internal Server Error'
      });
    }
  },

  ChangePasswordWithOtp: async (req, res) => {
    const userId = req.params.id;
    const { newPassword, enteredOTP } = req.body;
    try {
      const result = await userService.changeUserPasswordWithOTP(userId, newPassword, enteredOTP);
      res.status(200).json({
        response_code: 200,
        result, success: true, message: 'Password changed successfully.'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        response_code: 500,
        error: 'Internal Server Error'
      });
    }
  }

}

export default userController;