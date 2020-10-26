import React from 'react';
import './NftItem.css';
import { ItemIcon } from '../index';

const NftItem = ({item, size, rule, stats, itemImage, itemName, score, canLvUp, expWidth, onClickItem}) => (
    <div className="NftItem" onClick={onClickItem}>
      <div className="NftItemL">
        <ItemIcon item={item}
                  size={size}
                  rule={rule}
                  score={score}
                  canLvUp={canLvUp}
                  expWidth={expWidth}
                  itemImage={itemImage} />
      </div>
      <div className="NftItemC">
        <div>
          <div className="ItemTitle">
            {itemName}
          </div>
          { stats.map((stat) => {
            return (
                <div key={stat.type}>
                  { stat.type > 100?
                      <span className="SetStat">SET</span>
                      :
                      ""
                  }
                  <span className="Stats">{stat.name} {stat.value}</span>
                </div>
            );
          })}
        </div>
      </div>
    </div>
);

export default NftItem;