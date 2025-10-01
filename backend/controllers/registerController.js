<<<<<<< HEAD
import userRepo from "../repositories/userRepo.js";

export const registerUser = async (req, res) => {
    // Handle register logic here
    try {
        const { display_name, email, password, phone } = req.body;

        if (!email && !phone) {
            return res.status(400).send('Email hoặc số điện thoại không được để trống');
        }
        if (!password) {
            return res.status(400).send('Mật khẩu không được để trống');
        }

        //SĐT hoặc email không được trùng
        //Display name + pasword là được trùng
        const newUser = await userRepo.registerUser({ display_name, email, phone, password });

        res.status(201).json({
            message: 'Đăng ký thành công',
            user: newUser,
        });
    } catch (error) {
        console.error("Đăng ký thất bại", error);
        res.status(500).json({
            message: 'Lỗi máy chủ', error: error.message
        })
    }
    //call repository function to save user to database
}

export default registerUser;
=======
// note
>>>>>>> origin/main
