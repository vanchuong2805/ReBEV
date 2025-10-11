// import userContactService from "../../services/user/userContactService.js";
// import { ERROR_MESSAGE } from "../../config/constants.js";
// import { SUCCESS_MESSAGE } from "../../config/constants.js";

// const addUserContactDetail = async (req, res) => {
//     try {
//         const { user_id, detail, ward_id, name, phone } = req.body;
//         const user = await userContactService.getUserContactsByUserId(user_id);

//         if (!user) {
//             return res.status(400).json(ERROR_MESSAGE.USER_NOT_FOUND);
//         }
//         if (!detail) {
//             return res.status(400).json(ERROR_MESSAGE.CONTACT_DETAIL_BLANK);
//         }
//         if (!name) {
//             return res.status(400).json(ERROR_MESSAGE.CONTACT_NAME_BLANK);
//         }
//         if (!phone) {
//             return res.status(400).json(ERROR_MESSAGE.CONTACT_PHONE_BLANK);
//         }

//         const newContactDetail = await userContactService.createUserContact({ user_id, detail, ward_id, name, phone });

//         res.status(200).json({
//             message: SUCCESS_MESSAGE.ADD_CONTACT_DETAIL_SUCCESS,
//             contact: newContactDetail,
//         });

//     } catch (error) {
//         console.error(ERROR_MESSAGE.ADD_CONTACT_DETAIL_FAIL, error);
//         res.status(400).json({
//             error: error.message
//         })
//     }
// }
// export default addUserContactDetail;