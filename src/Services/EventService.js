import www from "../Utils/www.js";
import Config from "../Config/Config";

class EventService {

    async getRemainCraftEvents() {
        let url = Config.serverAdmin + "admin/v1/event/craft";
        return await www.getWithAlert(url, true);
    }

    async saveCraftEvent(craftEvent) {
        let url = Config.serverAdmin + "admin/v1/event/craft";
        return await www.postWithAlert(url, craftEvent, true);
    }

    async deleteCraftEvent(eventSeq) {
        let url = `${Config.serverAdmin}admin/v1/event/CRAFT/${eventSeq}`;
        return await www.delWithAlert(url, true);
    }

    async getRemainReferrerEvents() {
        let url = Config.serverAdmin + "admin/v1/event/referrer";
        return await www.getWithAlert(url, true);
    }

    async saveReferrerEvent(referrerEvent) {
        let url = Config.serverAdmin + "admin/v1/event/referrer";
        return await www.postWithAlert(url, referrerEvent, true);
    }

    async deleteReferrerCode(eventSeq, referrerCode) {
        let url = `${Config.serverAdmin}admin/v1/event/referrer/code/${eventSeq}/${referrerCode}`;
        return await www.delWithAlert(url, true);
    }

    async addReferrerCode(eventSeq, referrerCode, address) {
        let url = `${Config.serverAdmin}admin/v1/event/referrer/code/${eventSeq}/${referrerCode}/${address}`;
        return await www.postWithAlert(url, true);
    }

    async deleteReferrerEvent(eventSeq) {
        let url = `${Config.serverAdmin}admin/v1/event/referrer/${eventSeq}`;
        return await www.delWithAlert(url, true);
    }

    async getReferrerRates() {
        let url = `${Config.serverAdmin}admin/v1/event/referrer/rate`;
        return await www.getWithAlert(url, true);
    }
}

export default new EventService();
