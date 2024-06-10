import { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import IconButton from "../IconButton/IconButton";
import { FaStar } from "react-icons/fa";
import EditTaskModal from "../EditTaskModal/EditTaskModal";
import DeleteModal from "../DeleteModal/DeleteModal";
import axios from "axios";
import "sweetalert2/dist/sweetalert2.min.css";
import Swal from "sweetalert2";

const TaskDetails = ({ task, onTaskDeleted, getTaskData }) => {
  const [show, setShow] = useState(false);
  const [showDelete, setDeleteShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDeleteClose = () => setDeleteShow(false);
  const handleDeleteShow = () => setDeleteShow(true);

  const handleEditTask = async (updatedTaskData) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/task/updateTask/${task.id}`,
        updatedTaskData
      );
      getTaskData();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async () => {
    console.log(task.id);
    try {
      const response = await axios.delete(
        `http://localhost:8000/task/deleteTask/${task.id}`
      );

      if (response.status === 200) {
        const { message, deletedRateTask } = response.data;
        Swal.fire({
          icon: "success",
          title: "Success! ",
          text: message,
          showConfirmButton: false,
          timer: 1500,
        });
        console.log("RateTask data:", deletedRateTask);
        handleDeleteClose();
        onTaskDeleted(task._id);
      } else {
        console.error("Error deleting task rate:", response.data.error);
      }
    } catch (error) {
      console.error("Error deleting task rate:", error.message);
    }
  };
 
  
  const handleUpdateStatus = async (status) => {
    // Show SweetAlert confirmation before updating status
    Swal.fire({
      title: 'Update Task Status',
      text: 'Are you sure you want to update the status of this task?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(
            `http://localhost:8000/task/updateStatus/${task.id}`,
            { status }
          );

          if (response.status === 200) {
            const { message } = response.data;
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: message,
            }).then(() => {
              // Reload task data or perform other actions
              getTaskData();
            });
          } else {
            console.error("Error updating status:", response.data.error);
          }
        } catch (error) {
          console.error("Error updating status:", error.message);
        }
      }
    });
  };

  return (
    <div>
      <Container
        className="d-flex justify-content-between align-items-center mt-2"
        style={{
          backgroundColor: "#dff8dd79",
          borderBottom: "1px solid #91fb8c",
          borderRadius: "4px",
          height: "55px",
          boxShadow: "0 2px 2px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          className="col-3"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              marginLeft: "10px",
              color: "green",
              fontWeight: "600",
            }}
          >
            {task.name}
          </div>
        </div>
        <p
          style={{ fontSize: "17px", color: "gray", fontWeight: "600" }}
          className="col-2"
        >
          {task.description}
        </p>

        <div className="col-2">
          <select
            className="form-select"
            value={task.status}
            onChange={(e) => handleUpdateStatus(e.target.value)}
          >
            <option value="inprogress">In Progress</option>
            <option value="completed">Complete</option>
          </select>
        </div>

        <div className="m-3 d-flex">
          <button
            style={{
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
            }}
            onClick={handleShow}
          >
            <IconButton text="Edit" buttonColor={"green"} />
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
            }}
            onClick={handleDeleteShow}
          >
            <IconButton text="Delete" buttonColor={"red"} />
          </button>
        </div>
      </Container>
      <EditTaskModal
        show={show}
        handleClose={handleClose}
        taskData={task}
        handleEdit={handleEditTask}
      />
      <DeleteModal
        taskData={task}
        showDelete={showDelete}
        handleDeleteClose={handleDeleteClose}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default TaskDetails;
