import www from "../Utils/www.js";
import Config from "../Config/Config";

class AccountService {
  getAccount = async (uid) => {
    let url = Config.serverAdmin + "admin/v1/account/uid/" + uid;
    return await www.get(url, true);
  };

  getAccountByAddress = async (address) => {
    let url = Config.serverAdmin + "admin/v1/account/eth/" + address;
    return await www.get(url, true);
  };

  getCount = async () => {
    let url = Config.serverAdmin + "admin/v1/account/count";
    return await www.get(url, true);
  };
}

export default new AccountService();
