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
    this.today = moment().format("YYYY-MM-DD");
    this.hour = moment().format("H");
    this.ksLow = 0;
    this.ksHigh = 0;
    this.ks200Low = 0;
    this.ks200High = 0;
    this.kqLow = 0;
    this.kqHigh = 0;
  }

  initialize = async () => {
    this.output['KS11'] = ks11;
    this.output['KS200'] = ks200;
    this.output['KQ11'] = kq11;

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

    this.ksLow = parseInt(this.output['KS11'].predLow[index]);
    this.ksHigh = parseInt(this.output['KS11'].predHigh[index]);
    this.ks200Low = parseInt(this.output['KS200'].predLow[index]);
    this.ks200High = parseInt(this.output['KS200'].predHigh[index]);
    this.kqLow = parseInt(this.output['KQ11'].predLow[index]);
    this.kqHigh = parseInt(this.output['KQ11'].predHigh[index]);

    this.ksCenterDir = this.output['KS11'].predCenterD[index] > 0 ? 1 : 0;
    this.ks200CenterDir = this.output['KS200'].predCenterD[index] > 0 ? 1 : 0;
    this.kqCenterDir = this.output['KQ11'].predCenterD[index] > 0 ? 1 : 0;

    this.ksCloseDir = this.output['KS11'].predCloseD[index] > 0 ? 1 : 0;
    this.ks200CloseDir = this.output['KS200'].predCloseD[index] > 0 ? 1 : 0;
    this.kqCloseDir = this.output['KQ11'].predCloseD[index] > 0 ? 1 : 0;
  };
}

export default new DashboardService();
