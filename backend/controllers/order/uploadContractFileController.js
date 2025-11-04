import orderDetailService from '../../services/order/orderDetailService.js';

const uploadContractFileController = async (req, res) => {
    try {
        const { id } = req.params;
        const { contract_file } = req.body;
        const orderDetail = await orderDetailService.getById(id);
        if (!orderDetail) {
            return res.status(404).json({ error: 'Order detail not found' });
        }
        await orderDetailService.updateContractFile(id, contract_file);
        res.status(200).json({ message: 'Contract file updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default uploadContractFileController;
