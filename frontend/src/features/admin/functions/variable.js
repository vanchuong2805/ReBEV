import { fetchUsers } from "../service";

export const totalUsers = async () => {
  console.log(fetchUsers());
};
