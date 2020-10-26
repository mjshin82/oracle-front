import www from "../Utils/www.js";
import Config from "../Config/Config";

class KlaytnChainService {
    async getKlaytnBalances() {
        let url = Config.serverKlaytnChain + "chain/balances";
        const balances = await www.get(url, true);

        balances.k2AdminBalance = this.convertSton2Klay(balances.k2AdminBalance);
        return balances;
    }

    convertSton2Klay(ston) {
        return ston / 1000000000;
    }
}

export default new KlaytnChainService();