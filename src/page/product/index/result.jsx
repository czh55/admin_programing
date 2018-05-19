/*
* @Author: Rosen
* @Date:   2017-02-13 10:22:06
* @Last Modified by:   Rosen
* @Last Modified time: 2017-04-13 15:36:53
*/

'use strict';
import React        from 'react';
import ReactDOM     from 'react-dom';
import { Link }     from 'react-router';

import PageTitle    from 'component/page-title/index.jsx';
import RichEditor   from 'component/rich-editor/index.jsx';

import MMUtile      from 'util/mm.jsx';
import Result       from 'service/result.jsx';
import Product      from 'service/product.jsx';

const _mm = new MMUtile();
const _result = new Result();
const _product = new Product();

import './result.scss';

const ResultSave = React.createClass({
    getInitialState() {

        //传过来的是productId，而不是id
        return {
            id                  : '',
            SponsorId           : '',
            productId           : this.props.params.pId,
            title               : '',
            detail              : ''
        };
    },
    componentDidMount: function(){

        // 初始化结果
        this.loadResult();
    },
    // 编辑的时候，需要初始化结果信息
    loadResult(){
        _result.getResult(this.state.productId).then(res => {
            let result = this.resultAdapter(res)
            
            this.setState(result);

            this.refs['rich-editor'].setValue(result.detail);
        }, err => {
            //空执行
        });
    },
    // 适配接口返回的数据
    resultAdapter(result){
        return {
            id                  : result.id,
            sponsorId           : result.sponsorId,
            title               : result.title,
            detail              : result.detail
        }
    },
    // 普通字段更新
    onValueChange(e){
        let name    = e.target.name,
            value   = e.target.value;
        // 更改state
        this.setState({
            [name] : e.target.value
        });
    },
    // 富文本字段更新
    onRichValueChange(newValue){
        this.setState({
            detail: newValue
        });
    },
   
    // 验证要提交的信息是否符合规范
    checkResult(result){
        let re = {
            status  : true,
            msg     : '验证通过'
        };
        if(!result.title){
            re = {
                status  : false,
                msg     : '请输入结果名称'
            }
        }

        return re;
    },
    // 提交表单
    onSubmit(e){
        // 阻止提交
        e.preventDefault();
        // 需要提交的字段
        let result = {
                productId           : this.state.productId,
                title               : this.state.title,
                detail              : this.state.detail
            },
            checkResult = this.checkResult(result);
        // 当为编辑时，添加id字段
        if(this.state.id){
            result.id = this.state.id;
            result.sponsorId = this.state.sponsorId;
        }
        else{
            _product.getProduct(result.productId).then(res => {
                result.sponsorId = res.sponsorId;
            }, err => {
                alert(err.msg || '哪里不对了~');
            });
        }
        // 验证通过后，提交结果信息
        if(checkResult.status){
            // 保存result
            _result.saveResult(result).then(res => {
                alert(res);
                window.location.href = '#/product/index';
            }, err => {
                alert(err.msg || '哪里不对了~11');
            });
        }else{
            alert(checkResult.msg);
        }
        return false;
    },
    render() {
        return (
            <div id="page-wrapper">
                <PageTitle pageTitle={'结果管理 -- ' + (this.state.id ? '修改结果' : '添加结果')}/>
                <div className="row">
                    <div className="form-wrap col-lg-12">
                        <div className="form-horizontal">

                            <div className="form-group">
                                <label htmlFor="name" className="col-md-2 control-label">结果名称</label>
                                <div className="col-md-5">
                                    <input type="text" 
                                        className="form-control"
                                        name="title"
                                        id="name"
                                        placeholder="请输入结果名称"
                                        value={this.state.title}
                                        onChange={this.onValueChange}/>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="inputEmail3" className="col-md-2 control-label">结果详情</label>
                                <div className="col-md-10">
                                    <RichEditor ref="rich-editor" onValueChange={this.onRichValueChange} placeholder="结果详细信息"/>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-offset-2 col-md-10">
                                    <button type="btn" className="btn btn-xl btn-primary" onClick={this.onSubmit}>提交</button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default ResultSave;