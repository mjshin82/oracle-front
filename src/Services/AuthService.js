import www from "../Utils/www.js";
import EventEmitter from 'events';
import Config from "../Config/Config";

class AuthService {
  constructor() {
    this.ee = new EventEmitter();
    this.account = null;

    let account = JSON.parse(localStorage.getItem('account'));
    if (account !== null) {
      this.signByToken(account.authToken);
    }
  }

  cacheAuth() {
    if (this.account != null) {
      www.authId = this.account.authId;
      www.authToken = this.account.authToken;
      localStorage.setItem('account', JSON.stringify(this.account));
    }
  }

  clearAuth = () => {
    localStorage.removeItem('account');
    this.ee.emit('updated')
  };

  signUp = async (email, password) => {
    let url = Config.serverAdmin + "admin/v1/biscuit/auth/signup";
    let res = await www.post(url, { email, password }, true);
    if (res == null) {
      return;
    }

    this.account = res;
    this.cacheAuth();
    this.ee.emit('updated')
  };

  signIn = async (email, password) => {
    let url = Config.serverAdmin + "admin/v1/biscuit/auth/login";
    let res = await www.post(url, { email, password }, true);
    if (res == null) {
      return;
    }

    this.account = res;
    this.cacheAuth();
    this.ee.emit('updated')
  };

  signByToken = async (authToken) => {
    let url = Config.serverAdmin + "admin/v1/biscuit/auth/loginByToken/" + authToken;
    let res = await www.post(url, {}, true);
    if (res == null) {
      this.clearAuth();
      return;
    }

    this.account = res;
    this.cacheAuth();
    this.ee.emit('updated')
  };

  addEventHandler = async(key, event) => {
    this.ee.on(key, event);
  };

  removeEventHandler = async(key, event) => {
    this.ee.off(key, event);
  };
}

export default new AuthService();
