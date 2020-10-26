import React from 'react';
import './Footer.css';
import {Button} from "semantic-ui-react";

const Footer = ({onClickSignOut}) => (
  <div className="Footer">
    <div className="FooterWrapper">
      <div className="FooterHeading">
        <div className="BizDesc">
          <a size='tiny' onClick={onClickSignOut}>SignOut</a>
        </div>
      </div>
    </div>
  </div>
)

export default Footer;