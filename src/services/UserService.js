import axios from "axios";
const fetchAllUser = () => {
  return axios.get("https://reqres.in/api/users?page=2");
};

export { fetchAllUser };
