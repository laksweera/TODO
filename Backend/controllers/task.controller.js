import taskService from "../services/task.services.js";


const taskController = {
  addTask: async (req, res) => {
        try {
          const {name,description} = req.body;
          const userId = req.userId.id;

         
          const result = await taskService.addTask(name,description,userId);
    
          if (result.status) {
            res.status(200).json({
              response_code: 200,
              success: true,
              message: result.message,
              task:result
            });
          } else {
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

   
      updateStatus: async (req, res) => {
        const id = req.params.id;
        const {status} = req.body;
        try {
            const result = await taskService.updateStatus(id,status);
            return res.status(200).json({
                response_code: 200,
                success: true,
                message: 'Status updated successfully',
                result:result
            });
        } catch (error) {
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: "Internal Server Error",
                error: error.message
            });
        }
      },
      getAllTasks: async (req, res) => {
        try {
          const userId = req.userId.id;
            const allUsersResponse = await taskService.getAllTasks(userId);
            console.log("sss",allUsersResponse);

            if (allUsersResponse.status === false) {
                return res.status(500).json({
                    response_code: 500,
                    success: false,
                    message: allUsersResponse.message || 'Error occurred while fetching users'
                });
            }
    
            console.log(allUsersResponse);
            res.status(200).json({
                response_code: 200,
                success: true,
                tasks: allUsersResponse
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                response_code: 500,
                success: false,
                message: 'Error occurred while fetching users'
            });
        }
    }
,    

     
      deleteById : async (req, res) => {
        const id = req.params.id; 
        try {
          const result = await taskService.deleteTaskById(id);
          if (result) {
            return res.status(200).json({
              response_code: 200,
              status: true,
              message: "Task deleted successfully"
            });
          } else {
            return res.status(400).json({
              response_code: 400,
              status: false,
              message: " Task not found "
            });
          }
        } catch (error) {
          return res.status(500).json({
            response_code: 200,
            status: false,
            message: "Internal Server Error",
            error: error.message 
          });
        }
      },

      updateTaskById : async (req, res) => {
        try {
           const id = req.params.id;
           if( !req.body.name ||!req.body.description  ){
               return res.status(400).json({error:"Required fields are missing", status: false});
           }
           const { name,description} = req.body;
           const result = await taskService.updateTaskById(id,name,description);
           console.log(result);
           if(result.status){
               return res.status(200).json({message: result.message, status: result.status ,data:result.data});
           }else{
               return res.status(400).json({message: result.message, status: false});
           }
        } catch (error) {
           res.status(500).json({response_code:500,message:error.message});
        }   
      },

      getTaskById: async (req, res) => {
        const id = req.params.id;
        try {
          const user = await taskService.getTaskById(id);
          if (!user) {
            res.status(404).json({ response_code: 404, success: false, message: 'Task not found' });
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
    
}


export default taskController;