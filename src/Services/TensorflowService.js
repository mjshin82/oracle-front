import www from "../Utils/www.js";
import Config from "../Config/Config";
import * as tf from '@tensorflow/tfjs';

class TensorflowService {
  constructor(props) {
    this.model = null;
    this.data = new Map();
    this.output = new Map();
  }

  initialize = async () => {

    await this.loadRecent('KS11');
    await this.loadRecent('KQ11');
    await this.loadRecent('DJI');
    await this.loadRecent('IXIC');
    await this.loadRecent('SSEC');
    await this.loadRecent('STOXX50');
    //this.model = await tf.loadLayersModel('/data/model.json');


    await this.loadOutput('KS11');
  };

  loadRecent = async (code) => {
    let url = "/data/" + code + ".json";
    this.data[code] = await www.get(url, true);
    console.error( this.data[code])
  }


  loadOutput= async (code) => {
    let url = "/data/output/" + code + ".json";
    this.output[code] = await www.get(url, true);
    console.error( this.output[code])
  }
}

export default new TensorflowService();
