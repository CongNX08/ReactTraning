import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { deleteUser } from "../services/UserService";
import { toast } from "react-toastify";

function ModelConfirm(props) {
  const { show, handleClose, dataUserDelete, handleDeleteUserFromModel } =
    props;

  const confirmDelete = async () => {
    let res = await deleteUser(dataUserDelete.id);
    if (res && +res.statusCode === 204) {
      toast.success("deleted successfully");
      handleClose();
      handleDeleteUserFromModel(dataUserDelete);
    } else {
      toast.error("failed to delete");
    }
    // console.log(res);
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete a User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            Do you want to delete this user?
            <br />
            <b>Email = {dataUserDelete.email}</b>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => confirmDelete()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModelConfirm;
