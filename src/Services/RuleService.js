import www from "../Utils/www.js";
import EventEmitter from 'events';
import Config from "../Config/Config";

class RuleService {
  constructor() {
    this.ee = new EventEmitter();
  }

  init = () => {
  };

  deployRule = async () => {
    const path = 'admin/v1/rule/build';
    return await www.post(Config.serverAdmin + path, "", true);
  };

  deployLangs = async () => {
    const path = 'admin/v1/ml/build';
    return await www.post(Config.serverAdmin + path, "", true);
  };

}

export default new RuleService();
