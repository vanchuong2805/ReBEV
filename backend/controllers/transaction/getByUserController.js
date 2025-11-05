import transactionService from "../../services/transaction/transactionService.js";

const getByUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.user;
        if (user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const transactions = await transactionService.getByUser(user.id);
        res.status(200).json(transactions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default getByUser;
