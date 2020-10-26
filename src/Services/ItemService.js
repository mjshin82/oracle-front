import www from "../Utils/www.js";
import sb from './StringBundleService';
import Config from "../Config/Config";

class ItemService {
  constructor() {
    this.rules = JSON.parse(localStorage.getItem("itemRules"));
    this.revision = localStorage.getItem("itemRulesRevision");
    if (this.revision == null) {
      this.revision = 0;
    }

    this.badge = null;
    this.ruleItem = new Map();
    this.ruleItemLv = new Map();
    this.ruleItemSet = new Map();
    this.ready = false;
  }

  initialize = async() => {
    if (this.ready === true) {
      return true;
    }

    let rules = await www.get(Config.serverApi + "api/v1/rules/item/latest", true,
        {
          "Content-type": "application/json",
          "revision": this.revision,
        }
    );

    // cache to local storage
    if (rules != null && rules.item != null) {
      this.rules = rules;
      this.revision = rules.revision;
      localStorage.setItem("itemRules", JSON.stringify(this.rules));
      localStorage.setItem("itemRulesRevision", this.revision);
    }

    if (this.rules == null) {
      return false;
    }

    // cache rules
    for (let index = 0; index < this.rules.item.length; index++) {
      let item = this.rules.item[index];
      this.ruleItem.set(item.code, item);
    }

    for (let index = 0; index < this.rules.itemlv.length; index++) {
      let item = this.rules.itemlv[index];
      this.ruleItemLv.set(item.level, item);
    }

    for (let index = 0; index < this.rules.itemset.length; index++) {
      let item = this.rules.itemset[index];
      this.ruleItemSet.set(item.setid, item);
    }

    this.ready = true;
    return true;
  };

  getStats = (code, level, dna) => {
    let res = [];
    let rule = this.ruleItem.get(code);
    if (rule == null) {
      console.error("can not load rule for: " + code);
      return res;
    }

    let ruleLv = this.ruleItemLv.get(level);
    if (ruleLv == null) {
      return res;
    }

    let rate1 = dna & 0xFF;
    let rate2 = (dna >> 8) & 0xFF;
    let rate3 = (dna >> 16) & 0xFF;
    let reveal2 = (dna >> 24) & 0x2;
    let reveal3 = (dna >> 24) & 0x4;

    let stat1 = rule.stat1 + this.getItemVariationValue(rule.stat1Range, rate1);
    let stat2 = rule.stat2 + this.getItemVariationValue(rule.stat2Range, rate2);
    let stat3 = rule.stat3 + this.getItemVariationValue(rule.stat3Range, rate3);
    let bonus = ruleLv.bonus;

    stat1 = this.applyBonusStat(stat1, bonus);
    res.push({
      type: rule.stat1Type,
      name: this.getStatName(rule.stat1Type),
      value: parseInt(stat1)
    });

    if (reveal2 > 0 && rule.stat2Type > 0) {
      stat2 = this.applyBonusStat(stat2, bonus);
      res.push({
        type: rule.stat2Type,
        name: this.getStatName(rule.stat2Type),
        value: parseInt(stat2)
      });
    }
    if (reveal3 > 0 && rule.stat3Type > 0) {
      stat3 = this.applyBonusStat(stat3, bonus);
      res.push({
        type: rule.stat3Type,
        name: this.getStatName(rule.stat3Type),
        value: parseInt(stat3)
      });
    }

    if (rule.setid > 0) {
      let setRule = this.ruleItemSet.get(rule.setid);
      let setRuleElem = this.getSetStatFor(setRule, code);
      let setStatV = this.applyBonusStat(setRuleElem.stat, bonus);

      res.push({
        type: 100 + setRuleElem.type,
        name: this.getStatName(100 + setRuleElem.type),
        value: parseInt(setStatV)
      });
    }

    return res;
  };

  getSetStatFor(rule, code) {
    let result = {};
    if (code === rule.e1Code) {
      result.type = rule.e1Type;
      result.stat = rule.e1Stat;
    } else if (code === rule.e2Code) {
      result.type = rule.e2Type;
      result.stat = rule.e2Stat;
    } else if (code === rule.e3Code) {
      result.type = rule.e3Type;
      result.stat = rule.e3Stat;
    } else if (code === rule.e4Code) {
      result.type = rule.e4Type;
      result.stat = rule.e4Stat;
    } else if (code === rule.e5Code) {
      result.type = rule.e5Type;
      result.stat = rule.e5Stat;
    }

    return result;
  }

  getRequiredExp = (level) => {
    let lvCurrent = this.ruleItemLv.get(level);
    let lvNext = this.ruleItemLv.get(level + 1);
    if (lvNext == null) {
      return 0;
    }

    return lvNext.count - lvCurrent.count;
  };

  getStatName = (type) => {
    switch (type) {
      case 1:
      case 101:
        return sb.get("stat.name.stattack");
      case 2:
      case 102:
        return sb.get("stat.name.stdefense");
      case 3:
      case 103:
        return sb.get("stat.name.sthp");
      case 4:
      case 104:
        return sb.get("stat.name.stluck");
      default: return "";
    }
  };

  getItemVariationValue = (amount, rate) => {
    if (rate < 0) {
      rate = 0;
    }

    if (rate > 100) {
      rate = 100;
    }

    return -amount + (amount * 2) * rate / 100;
  };

  applyBonusStat = (stat, bonus) => {
    return stat * (bonus + 100) / 100;
  };

  nextInt = (range) => {
    return parseInt(Math.random() * range);
  };

  generateRandomDna = (stat2RevealRate, stat3RevealRate) => {
    let stat1 = this.nextInt(101);
    let stat2 = this.nextInt(101);
    let stat3 = this.nextInt(101);

    let reveal1 = 1;
    let reveal2 = this.nextInt(100) < stat2RevealRate ? 1 : 0;
    let reveal3 = this.nextInt(100) < stat3RevealRate ? 1 : 0;

    if (reveal2 === 0) {
      stat2 = 0;
    }
    if (reveal3 === 0) {
      stat3 = 0;
    }

    let reveal = (reveal3 << 2) | (reveal2 << 1) | reveal1;
    return (reveal << 24) | (stat3 << 16) | (stat2 << 8) | stat1;
  };

  calculateScore = (item) => {
    let rule = this.ruleItem.get(item.code);
    if (rule == null) {
      return 0;
    }

    let dna = item.dna;
    return this.calculateScoreWithDna(rule, dna);
  };

  calculateScoreWithDna = (rule, dna) => {
    let rate1 = dna & 0xFF;
    let rate2 = (dna >> 8) & 0xFF;
    let rate3 = (dna >> 16) & 0xFF;
    let reveal2 = (dna >> 24) & 0x2;
    let reveal3 = (dna >> 24) & 0x4;

    let stat1 = rule.stat1 + this.getItemVariationValue(rule.stat1Range, rate1);

    let stat2 = 0;
    if (reveal2 > 0) {
      stat2 = rule.stat2 + this.getItemVariationValue(rule.stat2Range, rate2);
    }

    let stat3 = 0;
    if (reveal3 > 0) {
      stat3 = rule.stat3 + this.getItemVariationValue(rule.stat3Range, rate3);
    }

    let stat1Max = rule.stat1 + rule.stat1Range;
    let stat2Max = rule.stat2 + rule.stat2Range;
    let stat3Max = rule.stat3 + rule.stat3Range;

    return parseInt((stat1 + stat2 + stat3) * 100 / (stat1Max + stat2Max + stat3Max));
  }
}

export default new ItemService();
