
'use strict';
import React        from 'react';
import ReactDOM     from 'react-dom';
import { Link }     from 'react-router';

import PageTitle    from 'component/page-title/index.jsx';
import Pagination   from 'component/pagination/index.jsx';

import MMUtile      from 'util/mm.jsx';
import Competition      from 'service/competition.jsx';

import User      from 'service/user.jsx';


const _mm = new MMUtile();
const _competition = new Competition();
const _user = new User();

import './index.scss';

const CompetitionList = React.createClass({
    getInitialState() {
        return {
            list            : [],
            listType        : 'list', // list / search
            searchType      : 'competitionId', // competitionId / competitionName
            searchKeyword   : '',
            pageNum         : 1,
            userId          : 0
        };
    },
    componentDidMount(){
        this.loadCompetitionList();
        let userInfo = _mm.getStorage('userInfo');
        if(userInfo){
            this.setState({
                userId : userInfo.id || -1
            });
        }
    },
    // 加载产品列表
    loadCompetitionList(pageNum){
        let listParam       = {},
            listType        = this.state.listType,
            searchType      = this.state.searchType;
            
        listParam.listType  = listType;
        listParam.pageNum   = pageNum || this.state.pageNum;
        // 按比赛名搜索
        if(listType == 'search' && searchType == "competitionName"){
            listParam.competitionName = this.state.searchKeyword;
        }
        // 按比赛id搜索
        if(listType == 'search' && searchType == "competitionId"){
            listParam.competitionId = this.state.searchKeyword;
        }
        // 按比赛status搜索
        if(listType == 'search' && searchType == "status"){
            listParam.status = this.state.searchKeyword;
        }
        // 查询
        _competition.getCompetitionList(listParam).then(res => {
            console.log(res)
            this.setState(res);
        }, errMsg => {
            _mm.errorTips(errMsg);
        });
    },
    // 搜索类型变化
    onSearchTypeChange(e){
        let searchType = e.target.value;
        this.setState({
            searchType : searchType
        });
    },
    // 关键词变化
    onKeywordChange(e){
        let keyword = e.target.value;
        this.setState({
            searchKeyword : keyword
        });
    },
    // 搜索
    onSearch(){
        this.setState({
            listType    : 'search'
        }, () => {
            this.loadCompetitionList(1);
        });
    },
    // 页数变化
    onPageNumChange(pageNum){
        this.loadCompetitionList(pageNum);
    },
    setCompetitionStatus(competitionId, status){
        let currentStatus   = status,
            newStatus       = currentStatus == 1 ? 2 : 1,
            statusChangeTips= currentStatus == 1 ? '确认要下架该比赛？' : currentStatus == 2 ? '确认要上架该比赛？' : '确定审核通过比赛？';
        if(window.confirm(statusChangeTips)){
            _competition.setCompetitionStatus(competitionId, newStatus).then(res => {
                // 操作成功提示
                _mm.successTips(res);
                this.loadCompetitionList();
            }, err => {
                _mm.errorTips(err.msg);
            });
        }
    },
    render() {       
        return (
            <div id="page-wrapper">
                <PageTitle pageTitle="比赛管理">
                    <div className="page-header-right">
                        <Link className="btn btn-primary" to="/competition/save"><i className="fa fa-plus fa-fw"></i>添加比赛</Link>
                    </div>
                </PageTitle>
                <div className="row">
                    <div className="search-wrap col-md-12">
                        <div className="form-inline">
                            <div className="form-group">
                                <select className="form-control" onChange={this.onSearchTypeChange}>
                                    <option value="competitionId">按比赛id查询</option>
                                    <option value="competitionName">按比赛名称查询</option>
                                    <option value="status">按比赛状态查询</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="关键词" onChange={this.onKeywordChange}/>
                            </div>
                            <button type="button" className="btn btn-default" onClick={this.onSearch}>查询</button>
                        </div>
                    </div>
                    <div className="table-wrap col-lg-12">
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>信息</th>
                                    <th>价格</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.list.length ? this.state.list.map((competition, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{competition.id}</td>
                                                <td>
                                                    <p>{competition.name}</p>
                                                    <p>{competition.subtitle}</p>
                                                </td>
                                                <td>{competition.price}</td>
                                                <td>
                                                    <span>{competition.status == 1 ? '在售'  : competition.status == 2 ? '已下架': '待审核'}</span>
                                                    {
                                                        this.state.userId != 1 && competition.status == 0 ? 
                                                        <span></span> :
                                                        <a className="btn btn-xs btn-warning opear" 
                                                            data-status={competition.status} 
                                                            onClick={this.setCompetitionStatus.bind(this, competition.id, competition.status)}>{competition.status == 1 ? '下架' : competition.status == 2 ? '上架': '审核批准'}</a>
                                                    }
                                                    
                                                </td>
                                                <td>
                                                    <Link className="opear" to={ '/competition/detail/' + competition.id}>查看</Link>
                                                    <Link className="opear" to={ '/competition/save/' + competition.id}>编辑</Link>
                                                    <Link className="opear" to={ '/competition/result/' + competition.id}>结果</Link>
                                                    <Link className="opear" to={ '/competition/code/' + competition.id}>代码</Link>
                                                </td>
                                            </tr>
                                        );
                                    }) :
                                    (
                                        <tr>
                                            <td colSpan="5" className="text-center">暂无结果~</td>
                                        </tr>
                                    )
                                }
                                            
                            </tbody>
                        </table>
                    </div>
                    {
                    this.state.pages > 1 ? <Pagination onChange={this.onPageNumChange} 
                        current={this.state.pageNum} 
                        total={this.state.total} 
                        showLessItems/>: null
                    }
                </div>
            </div>
        );
    }
});

export default CompetitionList;
