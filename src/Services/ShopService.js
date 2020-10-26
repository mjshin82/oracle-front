import www from '../Utils/www';
import config from '../Config/Config';

class ShopService {

    async getSpecialProducts() {
        const url = config.serverAdmin + "admin/v1/shop/specialProducts";

        return await www.getWithAlert(url, true);
    }

    async registerAdditionalRewards(data) {
        const url = config.serverAdmin + "admin/v1/shop/specialProduct/additionalReward";

        return await www.postWithAlert(url, data, true);
    }

    async removeAdditionalRewards(pid, rewardType) {
        const url = config.serverAdmin + `admin/v1/shop/specialProduct/additionalReward/${pid}/${rewardType}`;

        return await www.delWithAlert(url, true);
    }

}

export default new ShopService();