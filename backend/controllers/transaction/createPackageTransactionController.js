import { TRANSACTION_STATUS, TRANSACTION_TYPE } from '../../config/constants.js';
import transactionService from '../../services/transaction/transactionService.js';
import userService from '../../services/user/userService.js';

const createPackageTransaction = async (req, res) => {
    console.log('ok');
    try {
        const { resultCode, extraData, amount } = req.body;

        const packageTransaction = JSON.parse(extraData);
        console.log(resultCode, packageTransaction, amount);
        const transactionData = {
            sender_id: packageTransaction.user_id,
            transaction_type: TRANSACTION_TYPE.PACKAGE_FEE,
            related_package_id: packageTransaction.package_id,
            amount,
            status: resultCode,
        };
        // Create transaction
        await transactionService.createTransaction(transactionData);
        // update user package
        if (resultCode == TRANSACTION_STATUS.SUCCESS) {
            await userService.updatePackage(packageTransaction.user_id, {
                package_id: packageTransaction.package_id,
            });
        }
        res.status(201).json({ message: 'Package transaction created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};
export default createPackageTransaction;
