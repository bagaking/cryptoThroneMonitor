import React from 'react';
import {withRouter} from 'react-router-dom';
import {
  Menu, Dropdown, Icon, Button, message, Input,
} from 'antd';

import { connect } from 'react-redux';
import {updateAccountInfo, updateIdentity, updateCode} from '../redux/actions';

const codes = [
  'ctserver2111',
  'ctserver2112',
  'ctserver2113',
  'ctserver2114',
  'ctserver2115',
];

class SwitchNetwork extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingName: true,
    };

    this.networkMenuClick = async (e) => {
      eosplayer.switchNetwork(e.key);
      this.render();
    };

    this.codeClick = async (e) => {
      console.log('codeClick', e.key);
      this.props.history.push(`/${e.key}`);
      await eosplayer.getScatterAsync();
      await this.tryGetCode(e.key);
      this.props.updateCode(e.key);
    };

    this.tryGetCode = async (key) => {
      this.setState({ loadingName: true });
      this.props.updateIdentity({});
      this.props.updateAccountInfo(null);
      this.props.updateIdentity({name: key, authority: 'active'});
      this.props.updateAccountInfo(await eosplayer.getAccountInfo(key));
      this.setState({ loadingName: false });
    };

    this.networkMenu = (
      <Menu onClick={this.networkMenuClick}>
        {
             Object.keys(eosplayer._networks).map(v => (
               <Menu.Item key={v}>
                 <span>
                   {v}
:
                   {eosplayer._networks[v].host}
                 </span>
               </Menu.Item>
             ))
         }
      </Menu>);

    this.codeMenu = (
      <Menu onClick={this.codeClick}>
        {
                  codes.map(v => (
                    <Menu.Item key={v}>
                      <span>{v}</span>
                    </Menu.Item>
                  ))
              }
      </Menu>);
  }

  async componentDidMount() {
    console.log('componentDidMount', this.props.tab);
    eosplayer.events.setEvent(
      'ERR_GET_IDENTITY_FAILED',
      (e) => {
        console.log('ERR_GET_IDENTITY_FAILED');
        this.setState({ loadingName: false });
        this.props.updateIdentity({});
        this.props.updateAccountInfo(null);
        message.info(e.message);
      },
    ).setEvent(
      'ERR_LOGOUT_FAILED',
      (e) => {
        this.setState({ loadingName: false });
        this.props.updateIdentity({});
        this.props.updateAccountInfo(null);
      },
    );
    this.setState({ loadingName: false });
    // await this.tryGetCode();
    // this.props.updateIdentity(await eosplayer.getIdentity());
    // this.props.updateAccountInfo(await eosplayer.getAccountInfo());
    await eosplayer.getScatterAsync();
    if (!!this.props.tab && this.props.tab !== '') this.props.updateCode(this.props.tab);
    console.log(this.props.tab, this.props.code);
    await this.tryGetCode(this.props.code);
  }

  render() {
    return (
      <Button.Group>
        <Button type="dashed">
          <Dropdown overlay={this.networkMenu}>
            <div>
              {eosplayer.netConf.host}
              {' '}
              <Icon type="down" />
              {' '}
            </div>
          </Dropdown>
        </Button>

        <Button type="dashed">
          <Dropdown overlay={this.codeMenu}>
            <div>
              {this.props.code || '' }
              {' '}
              <Icon type="down" />
              {' '}
            </div>
          </Dropdown>
        </Button>

        {/* <Button type="dashed" loading={this.state.loadingName} onClick={this.switchIdentity}> */}
        {/* {this.props.identity ? `${this.props.identity.name}@${this.props.identity.authority}` : 'unknown'} */}
        {/* <Icon type="swap" /> */}
        {/* </Button> */}
      </Button.Group>
    );
  }
}

export default withRouter(connect(
  state => ({ ...state.accounts }),
  { updateAccountInfo, updateIdentity, updateCode },
)(SwitchNetwork));
