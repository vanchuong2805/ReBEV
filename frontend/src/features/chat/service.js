import axios from "axios";

export const getUserByID = async (userId) => {
  const res = await axios.get(
    `https://rebev.up.railway.app/api/users/${userId}`
  );
  return res.data.display_name; //string
};
