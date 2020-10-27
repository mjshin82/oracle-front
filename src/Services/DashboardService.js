import www from "../Utils/www.js";

class DashboardService {
  constructor() {
    this.iapLogs = [];
    this.output = new Map();
    this.output['KS11'] = {}
    this.output['KQ11'] = {}
  }

  initialize = async () => {
    await this.loadOutput('KS11');
    await this.loadOutput('KQ11');
  };

  loadOutput = async (code) => {
    let url = "/data/output/" + code + ".json";
    this.output[code] = await www.get(url, true);
  }
}

export default new DashboardService();
