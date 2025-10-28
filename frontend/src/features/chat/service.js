import axios from "axios";
import { useEffect, useState } from "react";

export const getUserByID = async (userId) => {
  const res = await axios.get(
    `https://rebev.up.railway.app/api/users/${userId}`
  );
  return res.data.display_name; //string
};
