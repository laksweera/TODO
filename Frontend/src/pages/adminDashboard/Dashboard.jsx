import { useEffect, useState } from "react";
import Side from "../../components/side/Side";
import Navbars from "../../components/NavBar/Navbar";
import TaskDetails from "../../components/taskDetail/TaskDetails";
import { FaPlus } from 'react-icons/fa'; 
import AddTaskModal from "../../components/AddUserModal/AddUserModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTaskData();
  }, []);

  const getTaskData = async () => {
    await axios
      .get("http://localhost:8000/task/getAllTasks", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.response_code === 500 && !res.data.success) {
          alert("You haven't any tasks.");
        } else {
          setTasks(res.data.tasks);
          console.log(res.data.tasks);
        }
      })
      .catch((err) => {
        console.log(err);
        navigate("/");
      });
  };

  // Get userId from token
 

  const handleTaskDeleted = (deletedTaskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== deletedTaskId));
  };

  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };


  return (
    <div className="adminPage">
    <Navbars />
    <div style={{ display: "flex" }}>
      <Side />
      <div
        className="ml-230px"
        style={{ marginLeft: "230px", marginTop: "50px", width: "100%" }}
      >
        <div
          style={{
            position: "relative",
            marginRight: "80px",
            marginBottom: "50px", // Add some margin at the bottom for spacing
          }}
          className="mt-2 d-flex justify-content-end"
        >
          <button
            onClick={handleShow}
            className="button-1 d-flex justify-content-center align-items-center"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              position: "absolute",
              top: 0,
              right: 0,
             
            }}
          >
            <FaPlus style={{ marginRight: "10px" }} />
            Add new
          </button>
        </div>
  
        {tasks &&
          tasks.map((task, index) => {
            return (
              <TaskDetails
                task={task}
                key={index}
                onTaskDeleted={handleTaskDeleted}
                getTaskData={getTaskData}
              />
            );
          })}
      </div>
    </div>
    <AddTaskModal
      show={show}
      setShow={setShow}
      handleClose={handleClose}
      getTaskData={getTaskData}
      handleTaskAdded={handleTaskAdded}
    />
  </div>
  
  );
};

export default Dashboard;
