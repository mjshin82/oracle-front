import React from 'react';
import { Image } from "semantic-ui-react";
import './ItemIcon.css';

const ItemIcon = ({item, size, rule, itemImage, score, canLvUp, expWidth}) => (
    <div className={"ItemIcon ItemIcon" + size}>
      <div className={ "ItemFrame ItemGradeColor" + rule.grade }>
        <Image className="Icon" src={itemImage} />
        <div className="ItemIconLevelBox">
          <div className={canLvUp ? "ItemIconLevelBarLvUp" : "ItemIconLevelBar"} style={{ width: expWidth }}/>
        </div>
        <div className={"ItemLevelBox ItemGradeBgColor" + rule.grade}>
          {"Level " + item.level}
        </div>
        <div className="ItemScore">
          {score}%
        </div>
      </div>
    </div>
);

export default ItemIcon;