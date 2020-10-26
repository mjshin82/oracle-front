import React from 'react';
import './DownloadBox.css';
import {Grid, Image} from 'semantic-ui-react';
import { ContentBox } from '..';
import download1 from './../../Images/download1.png';
import download2 from './../../Images/download2.png';
import download3 from './../../Images/download3.png';

const DownloadBox = ({onClickDownload}) => (
    <div className="DownloadBox" id="Download">
      <ContentBox>
        <div>
          <div className="GameInfoDescBox" >
            <h1>Download</h1>
          </div>
          <Grid doubling columns={8} className="DownloadIconBox">
            <Grid.Column>
              <Image src={download1} className="" onClick={() => onClickDownload("iOS")}/>
            </Grid.Column>
            <Grid.Column>
            <Image src={download2} className="" onClick={() => onClickDownload("android")}/>
            </Grid.Column>
            <Grid.Column>
              <Image src={download3} className="" onClick={() => onClickDownload("android")}/>
            </Grid.Column>
          </Grid>
        </div>

      </ContentBox>
    </div>
);

export default DownloadBox;