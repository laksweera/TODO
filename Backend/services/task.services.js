import taskRepo from "../repositories/task.repo.js";


const taskService = {
    addTask: async (name,description,userId) => {
        try {
   


            const result = await taskRepo.TaskCreate(name,description,userId);

            console.log(result);
            if (result) {    
                return {
                    status: true,
                    message: 'task registered successfully',
                    result: result,
                };
            }
    
        } catch (error) {
            return { status: false, message: error.message};
        }
    },

    updateStatus : async (id,status) => {
        try {
            const user = await taskRepo.getTaskById(id);
            if (!user) {
                throw new Error("task not found");
            }
            await taskRepo.updateStatus(id, status);
            return { status: true, updatedStatus: status };
        } catch (error) {
            return { status: false, message: error.message};
        }
    }
    ,getAllTasks: async (userId) => {
        try {
            const Tasks = await taskRepo.getAllTasks(userId);
            if ( Tasks.length==[])  {
                return { status: false, message: "No tasks found" };
            }
    
            return Tasks;
        } catch (error) {
            return { status: false, message: error.message };
        }
    }
,    
    getTaskById: async (id) => {
        try {
          const user = await taskRepo.getTaskById(id);
          return user;
        } catch (error) {
            return { status: false, message: error.message};
        }
      },

      deleteTaskById: async (id) => {
        try {
          const result = await taskRepo.deleteTaskById(id);
          return result > 0;
        } catch (error) {
            return { status: false, message: error.message};
        }
      },

      updateTaskById : async (id,name,description) => {
        try {
            const exTask = await taskRepo.getTaskById(id);
            console.log(exTask);
            if(!exTask) {
              return {
                status: false,
                message: "Task not found",
              };
            }	

            const result = await taskRepo.updateTaskData(id,name,description);
    
            const updatedData = await taskRepo.getTaskById(id);
            return {
              status: true,
              message: "task updated successfully",
              data: updatedData,
            };
           ;  
    
           
        } catch (error) {
            return { status: false, message: error.message};
        }
    },
      
}

export default taskService