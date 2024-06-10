import { Task } from "../models/model.js";


const taskRepo = {

    TaskCreate: async (name,description,userId) => {
        try {
          
          const result = await Task.create({
            name,
            description,
            userId
          }
          );
          return result;
        } catch (error) {
          throw error;
        }
      },

      deleteTaskById: async (id) => {
        try {
          const result = await Task.destroy({
            where: {
              id: id,
            }
          })
          return result;
        } catch (error) {
          throw error;
        }
      },
      
  getTaskById: async (id) => {
    try {
      const result = await Task.findOne({
        where: {
          id: id,
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },



updateStatus : async (id, status) => {
  try {
      const result = await Task.update(
          { status: status },
          { where: { id: id } }
      );
      return result;
  } catch (error) {
      throw error;
  }
}   ,

getAllTasks: async (userId) => {
  try {
      const allTasks = await Task.findAll({
        where: {
          userId: userId,
        },
      });
      return allTasks;
  } catch (error) {
      throw error;
  }
},

updateTaskData: async (id,name,description) => {
  try {
    const result = await Task.update({
      name: name,
      description:description,
    },{
      where: {
        id:id,
      },
    });
    return result;
  
  } catch (error) {
    throw error;
  }
},


}

export default taskRepo;