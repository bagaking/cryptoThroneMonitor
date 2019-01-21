// import marked from 'marked';
// import hljs from 'highlight.js';

import Path from 'path';

import React from 'react';

import {
  Card, Icon, BackTop, Layout, Tree, Collapse, Input, Col, Modal, Button,
} from 'antd';

import {MarkdownPreview} from 'react-marked-markdown';

import { connect } from 'react-redux';
import SwitchNetwork from './components/switchNetwork';

import { updateAccountInfo, updateIdentity } from './redux/actions';

import ctbg from './statics/ct_bg.png';


const {
  Header, Content, Sider,
} = Layout;

class ToolPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenAccount: '',
      tokenContract: 'eosio.token',
      tokenBalance: '**PLEASE RELOAD**',
      tokenTransContract: 'eosio.token',
      tokenTransFrom: '',
      tokenTransTo: '',
      tokenTransMemo: '',
      tokenTransMulti: '',
      evalCode: '',
      signMessage: '',
      signature: '',
    };
  }

  async componentDidMount() {
    // await eosplayer.getScatterAsync();
    // this.props.updateAccountInfo(await eosplayer.getAccountInfo());
  }

  async multiTransfer(code, from, memo) {
    try {
      const lines = this.state.tokenTransMulti.split('\n').map(v => v.trim()).filter(v => !!v && v !== '').map(v => v.split(',').map(x => x.trim()));
      console.log(lines);
      lines.forEach((l, i) => {
        if (l.length !== 2) {
          throw `error at line ${i} : ${l}`;
        }
        if (!/(^[a-z1-5.]{0,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)/.test(l[0])) {
          throw `account name error at line ${i} : ${l}`;
        }
        if (l[1].indexOf(' ') < 2) {
          throw `quantity error at line ${i} : ${l}`;
        }
      });
      console.log(lines);
      for (let i = 0; i < lines.length; i++) {
        await this.transferToken(code, from, ...lines[i], memo);
      }
    } catch (err) {
      Modal.error({
        title: 'Multi Transaction formation test failed',
        content: JSON.stringify(err),
      });
    }
  }

  async transferToken(code, from, to, quantity, memo) {
    const param = {
      from, to, quantity, memo,
    };
    console.log(code, param);
    const tokencode = await eosplayer.chain.getContract(code);
    console.log(tokencode);
    if (!tokencode) throw 'contract error';
    if (!tokencode.transfer) throw 'contract is not a token contract';

    return await tokencode.transfer(param, await eosplayer.getAuth()).then((v) => {
      console.log('Transfer success', param, v);
      Modal.success({
        title: 'Transfer success',
        content: `params:${param}
 txid:${v.transaction_id}`,
      });
    }).catch((err) => {
      console.log('Transfer failed', param, err);
      Modal.error({
        title: 'Transfer failed',
        content: `params:${param}
 err:${JSON.stringify(err)}`,
      });
    });
  }

  async signMessage(message) {
    console.log(`sign ${message}`);
    this.setState({signature: await eosplayer.sign(message)});
  }

  render() {
    const routeName = `#${Path.dirname(this.props.match.url)}`;
    const checkBalance = value => eosplayer.getBalance(value, this.state.tokenContract).then(tokenBalance => this.setState({tokenBalance}));
    return (
      <Layout style={{ minHeight: '100vh', background: '#509AAF' }}>
        <Header style={{
          background: '#A593E0', padding: '0 24px', minWidth: '100vw', color: '#FFFFF3',
        }}
        >
            PLAYGROUND
          {' '}
          <SwitchNetwork />
        </Header>
        <Layout style={{ height: '100vh' }}>
          <Sider>
            <Card
              style={{
                width: '101wh', height: '101vh', background: '#566270', color: '#FFFFF3' }}
              loading={!this.props.accountInfo}
            >
              {this.props.accountInfo
                ? (
                  <div>
                    <p>
                      Account:
                      <br />
                      {`${this.props.accountInfo.account_name}`}
                    </p>
                    <p>
    Balance:
                      <br />
                      {this.props.accountInfo.core_liquid_balance}
                    </p>
                    <p>
    CPU:
                      <br />
                      {`${this.props.accountInfo.cpu_limit.used}/${this.props.accountInfo.cpu_limit.max}`}
                    </p>
                    <p>
    NET:
                      <br />
                      {`${this.props.accountInfo.net_limit.used}/${this.props.accountInfo.net_limit.max}`}
                    </p>
                    <p>
    RAM:
                      <br />
                      {`${this.props.accountInfo.ram_usage}/${this.props.accountInfo.ram_quota}`}
                    </p>
                  </div>
                )
                : <snap>loading</snap>
                }
            </Card>
          </Sider>
          <Content style={{margin: '0 0 0', overflow: 'initial', height: '100vh', overflow: 'auto', backgroundImage: `url(${ctbg})`, backgroundSize: '100% 100%'}}>
            {/*<Collapse accordion defaultActiveKey={[this.props.match.params.tab || '3']}>*/}

              {/*<Collapse.Panel header="Token Tooles" key="1">*/}
                {/*<Card title="Balance">*/}
                  {/*<Input.Group style={{ marginBottom: 16 }} compact>*/}
                    {/*<Col span={10}>*/}
                      {/*<Input*/}
                        {/*addonBefore={<span>Contract</span>}*/}
                        {/*defaultValue="eosio.token"*/}
                        {/*value={this.state.tokenContract || ''}*/}
                        {/*onChange={(e) => { this.setState({tokenContract: e.target.value, tokenBalance: '**PLEASE RELOAD**'}); }}*/}
                        {/*onPressEnter={e => checkBalance(e.target.value)}*/}
                      {/*/>*/}
                    {/*</Col>*/}
                    {/*<Col span={14}>*/}
                      {/*<Input.Search*/}
                        {/*style={{borderLeft: 0 }}*/}
                        {/*// addonBefore={<span>Account</span>}*/}
                        {/*placeholder="input account text"*/}
                        {/*prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}*/}
                        {/*enterButton="Search"*/}
                        {/*value={this.state.tokenAccount}*/}
                        {/*onChange={(e) => { this.setState({tokenAccount: e.target.value, tokenBalance: '**PLEASE RELOAD**'}); }}*/}
                        {/*onPressEnter={e => checkBalance(e.target.value)}*/}
                        {/*onSearch={checkBalance}*/}
                      {/*/>*/}
                    {/*</Col>*/}
                  {/*</Input.Group>*/}
                  {/*<div style={{ marginBottom: 16, marginLeft: 8 }}>*/}
                    {/*<span>*/}
{/*Balance of*/}
                      {/*<span><b>{` ${this.state.tokenAccount} `}</b></span>*/}
                        {/*at*/}
                      {/*<span><b>{` ${this.state.tokenContract} `}</b></span>*/}
{/*:*/}
                      {/*<span><b>{` ${this.state.tokenBalance} `}</b></span>*/}
                    {/*</span>*/}
                  {/*</div>*/}
                {/*</Card>*/}
                {/*<Card title="Transfer">*/}
                  {/*<Input.Group style={{ marginBottom: 16 }}>*/}
                    {/*<Col span={10}>*/}
                      {/*<Input*/}
                        {/*addonBefore={<span>Contract</span>}*/}
                        {/*defaultValue="eosio.token"*/}
                        {/*value={this.state.tokenTransContract || ''}*/}
                        {/*onChange={(e) => { this.setState({tokenTransContract: e.target.value}); }}*/}
                        {/*onPressEnter={e => checkBalance(e.target.value)}*/}
                      {/*/>*/}
                    {/*</Col>*/}
                    {/*<Col span={14}>*/}
                      {/*<Input*/}
                        {/*addonBefore={<span>From</span>}*/}
                        {/*prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}*/}
                        {/*value={(this.props.accountInfo ? this.props.accountInfo.account_name : '')}*/}
                        {/*disabled*/}
                      {/*/>*/}

                    {/*</Col>*/}
                  {/*</Input.Group>*/}
                  {/*<div style={{ marginBottom: 16 }}>*/}
                    {/*<Input*/}
                      {/*addonBefore={<span>MEMO</span>}*/}
                      {/*value={this.state.tokenTransMemo || ''}*/}
                      {/*onChange={(e) => { this.setState({tokenTransMemo: e.target.value}); }}*/}
                    {/*/>*/}
                  {/*</div>*/}
                  {/*<Input.Group style={{ marginBottom: 16 }}>*/}
                    {/*<Col span={10}>*/}
                      {/*<Input*/}
                        {/*addonBefore={<span>To</span>}*/}
                        {/*prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}*/}
                        {/*value={this.state.tokenTransTo}*/}
                        {/*onChange={(e) => { this.setState({tokenTransTo: e.target.value}); }}*/}
                      {/*/>*/}
                    {/*</Col>*/}
                    {/*<Col span={14}>*/}
                      {/*<Input.Search*/}
                        {/*addonBefore={<span>Quantity</span>}*/}
                        {/*prefix={<Icon type="money-collect" style={{ color: 'rgba(0,0,0,.25)' }} />}*/}
                        {/*enterButton="Transfer"*/}
                        {/*onSearch={value => this.transferToken(*/}
                          {/*this.state.tokenTransContract,*/}
                          {/*this.props.accountInfo.account_name,*/}
                          {/*this.state.tokenTransTo,*/}
                          {/*value,*/}
                          {/*this.state.tokenTransMemo,*/}
                        {/*)}*/}
                      {/*/>*/}

                    {/*</Col>*/}

                  {/*</Input.Group>*/}
                  {/*<div style={{ marginBottom: 16 }}>*/}
                    {/*<Input.TextArea*/}
                      {/*rows={10}*/}
                      {/*value={this.state.tokenTransMulti || ''}*/}
                      {/*onChange={(e) => { this.setState({tokenTransMulti: e.target.value}); }}*/}
                    {/*/>*/}
                    {/*<Button*/}
                      {/*type="primary"*/}
                      {/*// shape="round"*/}
                      {/*onClick={e => this.multiTransfer(*/}
                        {/*this.state.tokenTransContract,*/}
                        {/*this.props.accountInfo.account_name,*/}
                        {/*this.state.tokenTransMemo,*/}
                      {/*)}*/}
                    {/*>*/}
                      {/*<Icon type="caret-right" />*/}
                        {/*Multi Transfer*/}
                    {/*</Button>*/}
                  {/*</div>*/}

                {/*</Card>*/}
              {/*</Collapse.Panel>*/}

              {/*<Collapse.Panel header="Sign message" key="2">*/}
                {/*<div style={{ marginBottom: 16 }}>*/}
                  {/*<Input.TextArea*/}
                    {/*rows={10}*/}
                    {/*value={this.state.signMessage || ''}*/}
                    {/*onChange={(e) => { this.setState({signMessage: e.target.value}); }}*/}
                  {/*/>*/}
                {/*</div>*/}
                {/*<Button onClick={e => this.signMessage(this.state.signMessage)}>*/}
                  {/*<Icon type="play-circle" />*/}
                      {/*Sign*/}
                {/*</Button>*/}
                {/*<Input.TextArea value={this.state.signature || ''} rows={2} />*/}

                {/*<p>{this.state.evalResult}</p>*/}
              {/*</Collapse.Panel>*/}

              {/*<Collapse.Panel header="Document" key="3">*/}
                {/*<MarkdownPreview value={eosplayer.help} />*/}
              {/*</Collapse.Panel>*/}

              {/*<Collapse.Panel header="Eval" key="4">*/}
                {/*<div style={{ marginBottom: 16 }}>*/}
                  {/*<Input.TextArea*/}
                    {/*rows={10}*/}
                    {/*value={this.state.evalCode || ''}*/}
                    {/*onChange={(e) => { this.setState({evalCode: e.target.value}); }}*/}
                  {/*/>*/}
                {/*</div>*/}
                {/*<Button onClick={e => this.setState({evalResult: eval(this.state.evalCode)})}>*/}
                  {/*<Icon type="play-circle" />*/}
                        {/*Run*/}
                {/*</Button>*/}
                {/*<p>{this.state.evalResult}</p>*/}
              {/*</Collapse.Panel>*/}
            {/*</Collapse>*/}

          </Content>
          <BackTop />
        </Layout>
      </Layout>

    );
  }
}

export default connect(
  state => ({...state.accounts}),
  {updateAccountInfo, updateIdentity},
)(ToolPage);