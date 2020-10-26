import www from '../Utils/www';
import config from '../Config/Config';


class MonitoringService {

    async getMonitoringData() {
        const url = config.serverAdmin + "admin/v1/monitoring"
        return await www.get(url, true);
    }

    async removeDefenseRoom(defenseRoomId) {
        const url = config.serverAdmin + "admin/v1/monitoring/delete/defenseRoom/" + defenseRoomId;
        return await www.del(url, true);
    }
}

export default new MonitoringService();