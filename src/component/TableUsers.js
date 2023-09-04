import axios from "axios";
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { fetchAllUser } from "../services/UserService";
import ReactPaginate from "react-paginate";
import ModelAddNew from "./ModelAddNew";
import ModelEditUser from "./ModelEditUser";
import ModelConfirm from "./ModelConfirm";
import _, { debounce } from "lodash";
import "./TableUsers.scss";
import { CSVLink, CSVDownload } from "react-csv";
import Papa from "papaparse";
import { toast } from "react-toastify";

function TableUsers(props) {
  const [listUsers, setListUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isShowModelAddNew, setIsShowModelAddNew] = useState(false);

  const [isShowModelEdit, setIsShowModelEdit] = useState(false);
  const [dataUserEdit, setDataUserEdit] = useState({});

  const [isShowModelDelete, setIsShowModelDelete] = useState(false);
  const [dataUserDelete, setDataUserDelete] = useState({});

  const [sortBy, setSortBy] = useState("asc");
  const [sortField, setSortField] = useState("id");

  const [keyword, setKeyword] = useState("");
  const [dataExport, setDataExport] = useState([]);

  const handleClose = () => {
    setIsShowModelAddNew(false);
    setIsShowModelEdit(false);
    setIsShowModelDelete(false);
  };

  const handleCreateTable = (user) => {
    setListUsers([user, ...listUsers]);
  };

  const handleEditUserFromModal = (user) => {
    let cloneListUsers = _.cloneDeep(listUsers);
    let index = listUsers.findIndex((item) => item.id === user.id);
    cloneListUsers[index].first_name = user.first_name;
    setListUsers(cloneListUsers);
  };

  useEffect(() => {
    getUsers(1);
  }, []);

  const getUsers = async (page) => {
    let res = await fetchAllUser(page);

    if (res && res.data) {
      setTotalUsers(res.total);
      setListUsers(res.data);
      setTotalPages(res.total_pages);
    }
  };

  const handlePageClick = (event) => {
    getUsers(+event.selected + 1);
  };
  const handleEditUser = (user) => {
    setDataUserEdit(user);
    setIsShowModelEdit(true);
  };

  const handleDeleteUser = (user) => {
    setIsShowModelDelete(true);
    setDataUserDelete(user);
  };

  const handleDeleteUserFromModel = (user) => {
    let cloneListUsers = _.cloneDeep(listUsers);
    cloneListUsers = cloneListUsers.filter((item) => item.id !== user.id);
    setListUsers(cloneListUsers);
  };

  const handleSort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField);

    let cloneListUsers = _.cloneDeep(listUsers);
    cloneListUsers = _.orderBy(cloneListUsers, [sortField], [sortBy]);
    setListUsers(cloneListUsers);
  };

  const handleSearch = debounce((event) => {
    let term = event.target.value;
    if (term) {
      let cloneListUsers = _.cloneDeep(listUsers);
      cloneListUsers = cloneListUsers.filter((item) =>
        item.email.includes(term)
      );
      setListUsers(cloneListUsers);
    } else {
      getUsers(1);
    }
  }, 500);

  const getUsersExport = (event, done) => {
    let result = [];
    if (listUsers && listUsers.length > 0) {
      result.push(["Id", "Email", "First Name", "Last Name"]);
      listUsers.map((item, index) => {
        let arr = [];
        arr[0] = item.id;
        arr[1] = item.email;
        arr[2] = item.first_name;
        arr[3] = item.last_name;
        result.push(arr);
      });
      setDataExport(result);
      done();
    }
  };

  const handleImportCSV = (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      let file = event.target.files[0];

      if (file.type !== "text/csv") {
        toast.error("Only CSV files are supported");
        return;
      }

      //Parse local CSV file
      Papa.parse(file, {
        // header: true
        complete: function (results) {
          let rawCSV = results.data;
          if (rawCSV.length > 0) {
            if (rawCSV[0] && rawCSV[0].length === 3) {
              if (
                rawCSV[0][0] !== "email" ||
                rawCSV[0][1] !== "first_name" ||
                rawCSV[0][2] !== "last_name"
              ) {
                toast.error("Wrong format Header CSV file!");
              } else {
                let result = [];
                rawCSV.map((item, index) => {
                  if (index > 0 && item.length === 3) {
                    let obj = [];
                    obj.email = item[0];
                    obj.first_name = item[1];
                    obj.last_name = item[2];
                    result.push(obj);
                  }
                });
                setListUsers(result);
              }
            } else {
              toast.error("Wrong format CSV file!");
            }
          } else toast.error("Not found data on CSV file!");
        },
      });
    }
  };
  return (
    <>
      <div className="my-3 add-new">
        <span>
          <b>List Users:</b>
        </span>
        <div className="group-btns">
          <label htmlFor="test" className="btn btn-warning">
            <i className="fa-solid fa-file-import"></i> Import
          </label>
          <input
            id="test"
            type="file"
            hidden
            onChange={(event) => handleImportCSV(event)}
          />

          <CSVLink
            filename={"users.csv"}
            className="btn btn-primary"
            data={dataExport}
            asyncOnClick={true}
            onClick={getUsersExport}
          >
            <i className="fa-solid fa-file-arrow-down"></i>
            Export
          </CSVLink>

          <button
            className="btn btn-success"
            onClick={() => setIsShowModelAddNew(true)}
          >
            <i className="fa-solid fa-circle-plus"></i> Add new
          </button>
        </div>
      </div>

      <div className="col-4 my-3">
        <input
          className="form-control"
          placeholder="Search user by email"
          // value={keyword}
          onChange={(event) => handleSearch(event)}
        />
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <div className="sort-header">
                <span>ID</span>
                <span>
                  <i
                    className="fa-solid fa-arrow-down-long"
                    onClick={() => handleSort("desc", "id")}
                  ></i>
                  <i
                    className="fa-solid fa-arrow-up-long"
                    onClick={() => handleSort("asc", "id")}
                  ></i>
                </span>
              </div>
            </th>
            <th>Email</th>
            <th className="sort-header">
              <div className="sort-header">
                <span>First Name</span>
                <span>
                  <i
                    className="fa-solid fa-arrow-down-long"
                    onClick={() => handleSort("desc", "first_name")}
                  ></i>
                  <i
                    className="fa-solid fa-arrow-up-long"
                    onClick={() => handleSort("asc", "first_name")}
                  ></i>
                </span>
              </div>
            </th>
            <th>Last Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listUsers &&
            listUsers.length > 0 &&
            listUsers.map((item, index) => {
              return (
                <tr key={`users-${index}`}>
                  <td>{item.id}</td>
                  <td>{item.email}</td>
                  <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>
                    <button
                      className="btn-warning mx-3"
                      onClick={() => handleEditUser(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => {
                        handleDeleteUser(item);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <ReactPaginate
        previousLabel="Previous"
        nextLabel="Next"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName="pagination"
        activeClassName="active"
        // forcePage={pageOffset}
      />
      <ModelAddNew
        show={isShowModelAddNew}
        handleClose={handleClose}
        handleCreateTable={handleCreateTable}
      />

      <ModelEditUser
        show={isShowModelEdit}
        dataUserEdit={dataUserEdit}
        handleClose={handleClose}
        handleEditUserFromModal={handleEditUserFromModal}
      />

      <ModelConfirm
        show={isShowModelDelete}
        handleClose={handleClose}
        dataUserDelete={dataUserDelete}
        handleDeleteUserFromModel={handleDeleteUserFromModel}
      />
    </>
  );
}

export default TableUsers;
