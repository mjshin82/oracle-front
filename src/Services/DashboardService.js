import moment from 'moment';
import ks11 from '../Data/output/KS11.json'
import ks200 from '../Data/output/KS200.json'
import kq11 from '../Data/output/KQ11.json'

class DashboardService {
  constructor() {
    this.output = new Map();
    this.output['KS11'] = {};
    this.output['KS200'] = {};
    this.output['KQ11'] = {};
    this.todya = ''
    this.today = moment().format("YYYY-MM-DD");
    this.hour = moment().format("H");
    this.ksLow = 0;
    this.ksHigh = 0;
    this.ks200Low = 0;
    this.ks200High = 0;
    this.kqLow = 0;
    this.kqHigh = 0;

    this.report = new Map();
    this.readyReport('KS11');
    this.readyReport('KS200');
    this.readyReport('KQ11');
  }

  readyReport = (code) => {
    this.report[code] = []
    this.report[code][0] = {
      close: 0,
      predLow: 0,
      predHigh: 0,
      predCenterDir: 0,
      predCloseDir: 0,
    }

    this.report[code][1] = {
      close: 0,
      predLow: 0,
      predHigh: 0,
      predCenterDir: 0,
      predCloseDir: 0,
    }
  };

  makeReport = (code) => {
    this.report[code][0] = {
      date: this.output[code].Date[18],
      close: this.output[code].Close[18].toFixed(2),
      predClose: this.output[code].predClose[18].toFixed(2),
      predLow: this.output[code].predLow[18].toFixed(2),
      predHigh: this.output[code].predHigh[18].toFixed(2),
      predCenterDir: this.output[code].predCenterD[18] > 0 ? 1 : 0,
      predCloseDir: this.output[code].predCloseMD[18] > 0 ? 1 : 0,
      closeExp: this.output[code].predCloseM[18].toFixed(2)
    }

    this.report[code][1] = {
      date: '다음장',
      close: 0,
      predClose: this.output[code].predClose[19].toFixed(2),
      predLow: this.output[code].predLow[19].toFixed(2),
      predHigh: this.output[code].predHigh[19].toFixed(2),
      predCenterDir: this.output[code].predCenterD[19] > 0 ? 1 : 0,
      predCloseDir: this.output[code].predCloseMD[19] > 0 ? 1 : 0,
      closeExp: this.output[code].predCloseM[19].toFixed(2)
    }
  };

  initialize = async () => {
    this.output['KS11'] = ks11;
    this.output['KS200'] = ks200;
    this.output['KQ11'] = kq11;

    this.today = this.output['KS11'].Date['18']

    let index = "19";
    if (this.output['KS11'].Date['18'] === this.today) {
      if (parseInt(this.hour) >= 9 && parseInt(this.hour) < 15) {
        index = "18";
      }

      this.output['KS11'].Date['18'] = '오늘';
      this.output['KS11'].Date['19'] = '다음장';
      this.output['KS200'].Date['18'] = '오늘';
      this.output['KS200'].Date['19'] = '다음장';
      this.output['KQ11'].Date['18'] = '오늘';
      this.output['KQ11'].Date['19'] = '다음장';
    } else if (this.output['KS11'].Date['19'] === this.today) {
      this.output['KS11'].Date['19'] = '오늘';
      this.output['KS200'].Date['19'] = '오늘';
      this.output['KQ11'].Date['19'] = '오늘';
    } else {
      this.output['KS11'].Date['19'] = '다음장';
      this.output['KS200'].Date['19'] = '다음장';
      this.output['KQ11'].Date['19'] = '다음장';
    }

    this.makeReport('KS11');
    this.makeReport('KS200');
    this.makeReport('KQ11');
  };
}

export default new DashboardService();
