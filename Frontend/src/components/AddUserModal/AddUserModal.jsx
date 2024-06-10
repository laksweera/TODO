import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FaUser, FaFile } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddUserModal = ({ handleClose, show,handleTaskAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const history = useNavigate();

  useEffect(() => {
    // Reset form data when modal is opened
    if (show) {
      setFormData({
        name: "",
        description: ""
      });
    }
  }, [show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }; 

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/task/createTask",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
          },
        }
      );

      if (response.data.response_code === 200) {
        // Move to dashboard
        console.log(response.data.task.result)
        const newTask = response.data.task.result; // Assuming the response contains the new task
        handleTaskAdded(newTask)
        history("/");
        
        // Close the modal
        handleClose();
      }

      // Handle other status codes if needed
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle error
    }
  };

  const handleCloseModal = () => {
    // Move to dashboard
    history("/");
    // Close the modal
    handleClose();
  };

  return (
    <div>
      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTaskName">
              <Form.Label><FaUser /> Task Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter task name"
              />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label><FaFile /> Description:</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter task description"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddUserModal;
