import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';
import { FaFile, FaTasks } from 'react-icons/fa';
import FileBase64 from 'react-file-base64';

const EditTaskModal = ({ handleClose, show, taskData, handleEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
  });

  useEffect(() => {
    setFormData({
      name: taskData.name,
      description: taskData.description,
      image: taskData.image,
    });
  }, [taskData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    handleEdit(formData);
    handleClose();
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title style={{ margin: "auto", paddingLeft: "0px", fontSize: "30px" }}>
            Edit Task
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>
                Task Name:
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter task name"
                style={{ borderRadius: "10px" }}
              />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>
                 Description:
              </Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter task description"
                style={{ borderRadius: "10px" }}
              />
            </Form.Group>

         
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
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

export default EditTaskModal;
