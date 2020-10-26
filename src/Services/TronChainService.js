import www from "../Utils/www.js";
import Config from "../Config/Config";

class TronChainService {
    async getTronBalances() {
        let url = Config.serverTronChain + "chain/balances";
        const balances = await www.get(url, true);

        balances.k2AdminBalance = this.convertSun2Trx(balances.k2AdminBalance);
        balances.k2AdminFrozenBalance = this.convertSun2Trx(balances.k2AdminFrozenBalance);
        balances.mykbBalance = this.convertSun2Trx(balances.mykbBalance);
        balances.dailyAttendanceBalance = this.convertSun2Trx(balances.dailyAttendanceBalance);
        return balances;
    }

    async freezeTRX(trx, freezeType) {
        let url = Config.serverTronChain + "chain/trx/freeze";
        await www.post(url, {trx: '' + trx, to: freezeType}, true);
    }

    async withdrawMyKBContract(trx) {
        let url = Config.serverTronChain + "chain/withdraw/mykb";
        await www.post(url, {trx: '' + trx}, true);
    }

    async sendToDailyAttendanceContract(trx) {
        let url = Config.serverTronChain + "chain/send/dailyAttendance";
        await www.post(url, {trx: '' + trx}, true);
    }

    convertSun2Trx(sun) {
        return sun / 1000000;
    }

}

export default new TronChainService();
