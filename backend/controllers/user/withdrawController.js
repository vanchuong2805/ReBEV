import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../config/constants.js";
import { sequelize } from "../../models/index.js";
import transactionService from "../../services/transaction/transactionService.js";
import userService from "../../services/user/userService.js";
/**
 * @swagger
 * /users/{id}/withdraw:
 *   post:
 *     summary: Withdraw money from user account
 *     description: Allows a user to withdraw money from their account
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *       - in: body
 *         name: body
 *         required: true
 *         description: Withdrawal information
 *         schema:
 *           type: object
 *           properties:
 *             amount:
 *               type: integer
 *               example: 100000
 *     responses:
 *       200:
 *         description: Withdrawal successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Withdrawal successful
 *                 balance:
 *                   type: integer
 *                   example: 900000
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
const withdrawController = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {id} = req.params;
        const userID = req.user.id;
        const {amount} = req.body;
        if (!amount || amount <= 0) {
            return  res.status(400).json({ message: 'Invalid amount' });
        }
        if (amount < 50000 || amount > 50000000) {
            return res.status(400).json({ message: 'Amount must be between 50,000 and 50,000,000' });
        }
        if (userID != id) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const user = await userService.getUser(userID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        await userService.withdraw(id, amount, { transaction: t });
        await transactionService.createTransaction({
            receiver_id: user.id,
            transaction_type: TRANSACTION_TYPE.CASH_OUT,
            amount,
            status: TRANSACTION_STATUS.SUCCESS,
        }, { transaction: t });
        await t.commit();
        res.status(200).json({ message: 'Withdrawal successful', balance: user.balance - amount });
    } catch (error) {
        console.log(error)
        if (t) await t.rollback();
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default withdrawController ;