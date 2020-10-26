import www from "../Utils/www.js";
import Config from "../Config/Config";

class DashboardService {
  constructor() {
    this.iapLogs = [];
    this.clearStore();
    this.clearProduct();
  }

  clearStore = () => {
    this.store = new Map();
    this.storeS = new Map();
    this.storeR = new Map();
    this.store.set('ios', 0);
    this.store.set('android', 0);
    this.store.set('WEB', 0);
    this.store.set('TWEB', 0);
    this.store.set('Total', 0);

    this.storeS.set('ios', 0);
    this.storeS.set('android', 0);
    this.storeS.set('WEB', 0);
    this.storeS.set('TWEB', 0);
    this.storeS.set('Total', 0);

    this.storeR.set('ios', 0);
    this.storeR.set('android', 0);
    this.storeR.set('WEB', 0);
    this.storeR.set('TWEB', 0);
    this.storeR.set('Total', 0);
  };

  clearProduct = () => {
    this.product = new Map();
    this.product.set('ubean1', 0);
    this.product.set('ubean2', 0);
    this.product.set('ubean3', 0);
    this.product.set('ubean4', 0);
    this.product.set('ubean5', 0);
    this.product.set('ubean6', 0);
    this.product.set('mkt1', 0);
    this.product.set('mkt2', 0);
    this.product.set('mkt3', 0);
    this.product.set('pack1', 0);
    this.product.set('pack2', 0);
    this.product.set('pack3', 0);
    this.product.set('pack4', 0);
    this.product.set('fixedpet1', 0);
    this.product.set('fixedpet2', 0);
    this.product.set('timesale1', 0);
    this.product.set('timesale2', 0);
    this.product.set('timesale3', 0);
    this.product.set('petbox1', 0);
    this.product.set('petbox2', 0);
    this.product.set('petbox3', 0);
    this.product.set('petbox4', 0);

    this.price = new Map();
    this.price.set('ubean1',  0.99);
    this.price.set('ubean2',  2.99);
    this.price.set('ubean3',  5.99);
    this.price.set('ubean4', 13.99);
    this.price.set('ubean5', 33.99);
    this.price.set('ubean6', 64.99);
    this.price.set('mkt1', 0.99);
    this.price.set('mkt2', 1.99);
    this.price.set('mkt3', 3.99);

    this.price.set('pack1', 5.99);
    this.price.set('pack2', 13.99);
    this.price.set('pack3', 33.99);
    this.price.set('pack4', 0.99);
    this.price.set('fixedpet1', 7.99);
    this.price.set('fixedpet2', 19.99);
    this.price.set('timesale1', 9.99);
    this.price.set('timesale2', 23.99);
    this.price.set('timesale3', 42.99);
    this.price.set('petbox1', 1.99);
    this.price.set('petbox2', 8.99);
    this.price.set('petbox3', 28.99);
    this.price.set('petbox4', 0.99);

    this.price.set('pack1-v2', 3.99);
    this.price.set('pack2-v2', 12.99);
    this.price.set('pack3-v2', 26.99);

    this.price.set('petbox1-v2', 0.99);
    this.price.set('petbox2-v2', 7.99);
    this.price.set('petbox3-v2', 19.99);

    this.v2No = 19712;
  };

  getAllIapLogs = async () => {
    let from = 0;
    let iapLogs = localStorage.getItem('iapLogs');
    if (iapLogs != null) {
      this.iapLogs = JSON.parse(iapLogs);
      from = this.iapLogs.length;
    }

    while (true) {
      let newLogs = await this.getIapLogs(from, 100);
      if (newLogs == null) {
        break;
      }


      if (this.iapLogs == null) {
        this.iapLogs = [];
      }

      newLogs.forEach(e => {
        this.iapLogs.push(this.minize(e));
      });

      from = this.iapLogs.length;

      if (newLogs.length < 100) {
        break;
      }
    }

    localStorage.setItem('iapLogs', JSON.stringify(this.iapLogs));
    this.analysis();
  };

  minize = (log) => {
    return {
      no: log.no,
      uid: log.uid,
      store: log.store,
      productId: log.productId,
      purchaseYmdt: log.purchaseYmdt
    }
  };

  analysis = () => {
    this.clearStore();
    this.clearProduct();
    this.iapLogs.forEach( (e) => {
      let pid = e.productId;
      let store = e.store;
      let price = this.price.get(pid);
      if (e.no >= this.v2No && this.price.get(pid + "-v2") !== null) {
        price = this.price.get(pid + "-v2");
      }

      let revenue = this.price.get(pid) * this.revenueRate(store);
      let totalK = 'Total';

      this.store.set(store, this.store.get(store) + 1);
      this.product.set(pid, this.product.get(pid) + 1);
      this.storeS.set(store, this.storeS.get(store) + price);
      this.storeR.set(store, this.storeR.get(store) + revenue);

      this.storeS.set(totalK, this.storeS.get(totalK) + price);
      this.storeR.set(totalK, this.storeR.get(totalK) + revenue);
    })
  };

  revenueRate = (store) => {
    if (store === 'ios' || store === 'android') {
      return 0.7;
    }
    return 0.9;
  };

  getIapLogs = async (from, length) => {
    let url = Config.serverAdmin + `admin/v1/dashboard/iap/logs/${from}/${length}`;
    return await www.get(url, true);
  };
}

export default new DashboardService();
