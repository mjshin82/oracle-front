import www from "../Utils/www.js";
import Config from "../Config/Config";

class GiftService {
  giftRuby = async (eventName, ruby, uids) => {
    let url = Config.serverAdmin + "admin/v1/account/event/ruby";
    let res = await www.post(url, {
      eventName,
      ruby,
      uids
    }, true);

    return res;
  };

  giftPet = async (eventName, code, uids) => {
    let url = Config.serverAdmin + "admin/v1/account/event/pet";
    let res = await www.post(url, {
      eventName,
      code,
      uids
    }, true);

    return res;
  };

  checkGift = async (eventName) => {
    let url = Config.serverAdmin + "admin/v1/account/event/" + eventName;
    console.error(url);
    let res = await www.get(url, true);
    return res;
  };
}

export default new GiftService();
