import nodeCron from 'node-cron';
import userService from '../services/user/userService.js';

// test mỗi 1p
const autoCancelPackage = nodeCron.schedule('* * * * *', async () => {
    // Logic to cancel packages
    const users = await userService.getExpiredPackageUsers();
    for (const user of users) {
        try {
            await userService.updatePackage(user.id, { package_id: null });
            console.log(`Cancelled package for user ID: ${user.id}`);
        } catch (error) {
            console.log(`Error cancelling package for user ID: ${user.id} - ${error.message}`);
        }
    }
});

export default autoCancelPackage;
