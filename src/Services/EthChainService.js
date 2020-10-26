import www from "../Utils/www.js";
import Config from "../Config/Config";

class EthChainService {

    async getEthBalances() {
        let url = Config.serverChain + "eth/admin/balance";
        const balances = await www.get(url, true);

        balances.k2AdminBalance = this.wei2Eth(balances.k2AdminBalance);
        balances.mykbBalance = this.wei2Eth(balances.mykbBalance);
        balances.dailyAttendanceBalance = this.wei2Eth(balances.dailyAttendanceBalance);

        return balances;
    }

    async withdrawEth(eth) {
        let url = Config.serverChain + "eth/mykb/withdraw";
        await www.post(url, {eth: '' + eth}, true);
    }

    async transferEth(eth) {
        let url = Config.serverChain + "eth/dailyattendance/transfer";
        await www.post(url, {eth: '' + eth}, true);
    }

    wei2Eth(wei) {
        const gwei = wei / 1000000000;
        const eth = gwei / 1000000000;

        return eth;

    }

}

export default new EthChainService();
