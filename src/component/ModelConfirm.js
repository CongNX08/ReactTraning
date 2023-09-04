import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ModelConfirm(props) {
  const { show, handleClose, dataUserDelete } = props;

  const confirmDelete = () => {};
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
