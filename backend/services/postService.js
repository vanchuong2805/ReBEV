import post from "../repositories/postRepo";

const getAll = async () => {
  return await post.findAll();
}

const getById = async (id) => {
  return await post.findByPk(id);
}

const getByUserId = async (userId) => {
  return await post.findAll({ where: { user_id: userId } });
}

export default { getAll, getById, getByUserId };