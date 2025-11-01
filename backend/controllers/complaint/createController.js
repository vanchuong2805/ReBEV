const createComplaint = async (req, res) => {
    try {
        const { user } = req;
        const { order_detail_id, complaint_type, description, media } = req.body;
    } catch (error) {
        console.log(error)
    }
}
export default createComplaint;