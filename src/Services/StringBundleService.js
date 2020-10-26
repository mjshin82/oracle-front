import EventEmitter from 'events';
import bundle from "../Config/StringBundle.json";
import sf from 'sf';

class StringBundleService {
  ee = new EventEmitter();

  constructor() {
    this.load();

    let lang = localStorage.getItem('lang');
    if (lang !== null) {
      this._setLang(lang);
    } else {
      this._setLang('en');
      this._setLang(this.getSystemLang());
    }
  }

  getSystemLang = () => {
    let systemLang = navigator.language || navigator.userLanguage;
    let dash = systemLang.indexOf("-");
    if (dash > 0) {
      systemLang = systemLang.substr(0, dash);
    }

    return systemLang;
  };

  load = () => {
    this.sb = new Map();
    for (let index = 0; index < bundle.length; index++) {
      let item = bundle[index];
      this.sb.set(item.key.toLowerCase(), item);
    }
  };

  changeLang = (lang) => {
    this._setLang(lang);
    this.ee.emit('updated');
  };

  _setLang = (lang) => {
    if (lang === 'ko') {
      this.lang = lang;
      this.flagCode = 'kr';
      this.language = '한국어';
    } else if (lang === 'ja') {
      this.lang = lang;
      this.flagCode = 'jp';
      this.language = '日本語';
    } else if (lang.indexOf('zh') === 0) {
      this.lang = lang;
      this.flagCode = 'cn';
      this.language = '中文';
    } else {
      this.lang = 'en';
      this.flagCode = 'us';
      this.language = 'English';
    }

    localStorage.setItem('lang', this.lang);
  };

  addEventHandler = async(key, event) => {
    this.ee.on(key, event);
  };

  get = (key) => {
    let res = this.sb.get(key.toLowerCase());
    if (res == null) {
      return key;
    }

    let value = this.getWithLang(key.toLowerCase(), this.lang);
    if (value == null || value == undefined) {
      let enRes = this.getWithLang(key.toLowerCase(), 'en');
      if (enRes == null || enRes == undefined) {
        return key;
      }
    }
    return value;
  };

  format = (key, ...args) => {
    let res = this.get(key);
    if (res == null) {
      return key;
    }
    return sf(res, args);
  };

  getWithLang = (key, lang) => {
    let res = this.sb.get(key);
    if (res != null) {
      if (lang === 'en') {
        return res.en;
      }

      if (lang === 'ko') {
        return res.ko;
      }

      if (lang === 'ja') {
        return res.ja;
      }

      if (lang === 'zh') {
        return res.zh;
      }
    }

    return "";
  };
}

export default new StringBundleService();
