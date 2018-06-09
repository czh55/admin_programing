
'use strict';
import React        from 'react';
import ReactDOM     from 'react-dom';
import { Link }     from 'react-router';

import PageTitle    from 'component/page-title/index.jsx';

import MMUtile      from 'util/mm.jsx';
import Application        from 'service/application.jsx';

import './detail.scss';

const _mm           = new MMUtile();
const _application        = new Application();


const ApplicationDetail = React.createClass({
    getInitialState() {
        return {
            applicationNumber: this.props.params.applicationNumber,
            applicationInfo : {}
        };
    },
    componentDidMount: function(){
        // 初始化比赛
        this.loadApplicationDetail();
    },
    // 加载detail信息
    loadApplicationDetail(){
        _application.getApplicationDetail(this.state.applicationNumber).then(res => {
            this.setState({
                applicationInfo: res
            });
        }, errMsg => {
            _mm.errorTips(errMsg);
        });
    },
    render() {
        let competitionList     = this.state.applicationInfo.applicationItemVoList  || [],
            receiverInfo    = this.state.applicationInfo.shippingVo       || {}
        return (
            <div id="page-wrapper">
                <PageTitle pageTitle="报名详情"/>
                <div className="row">
                    <div className="form-wrap col-lg-12">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-2 control-label">报名号：</label>
                                <div className="col-md-5">
                                    <p type="text" className="form-control-static">{this.state.applicationInfo.applicationNo}</p>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="subtitle" className="col-md-2 control-label">创建时间：</label>
                                <div className="col-md-5">
                                    <p type="text" className="form-control-static">{this.state.applicationInfo.createTime}</p>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="subtitle" className="col-md-2 control-label">报名状态：</label>
                                <div className="col-md-5">
                                    <p type="text" className="form-control-static">
                                        {this.state.applicationInfo.statusDesc}
                                    </p>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="subtitle" className="col-md-2 control-label">支付方式：</label>
                                <div className="col-md-5">
                                    <p type="text" className="form-control-static">{this.state.applicationInfo.paymentTypeDesc}</p>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="subtitle" className="col-md-2 control-label">报名金额：</label>
                                <div className="col-md-5">
                                    <p type="text" className="form-control-static">￥{this.state.applicationInfo.payment}</p>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <table className="table table-striped table-bapplicationed table-hover">
                                    <thead>
                                        <tr>
                                            <th width="15%">比赛图片</th>
                                            <th width="40%">比赛信息</th>
                                            <th width="15%">报名费</th>
                                            <th width="15%">合计</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            competitionList.map((competition, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <img className="p-img" src={this.state.applicationInfo.imageHost + competition.competitionImage} alt={competition.competitionName}/>
                                                        </td>
                                                        <td>{competition.competitionName}</td>
                                                        <td>￥{competition.currentUnitPrice}</td>
                                                        <td>￥{competition.totalPrice}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default ApplicationDetail;