'use strict';
import React        from 'react';
import ReactDOM     from 'react-dom';
import { Link }     from 'react-router';

import PageTitle    from 'component/page-title/index.jsx';
import FileUploader from 'component/file-uploader/index.jsx';
import RichEditor   from 'component/rich-editor/index.jsx';

import MMUtile from 'util/mm.jsx';
import Competition      from 'service/competition.jsx';

const _mm = new MMUtile();
const _competition = new Competition();

import './save.scss';

const CompetitionSave = React.createClass({
    getInitialState() {
        return {
            id                  : this.props.params.pId,
            firstCategoryList   : [],
            firstCategoryId     : '',
            secondCategoryList  : [],
            secondCategoryId    : '',
            name                : '',
            subtitle            : '',
            subImages           : [],
            price               : '',
            stock               : '',
            detail              : '',
            status              : ''

        };
    },
    componentDidMount: function(){
        // 初始化一级分类
        this.loadFirstCategory();
        // 初始化产品
        this.loadCompetition();
    },
    // 加载一级分类
    loadFirstCategory(){
        // 查询一级品类时，不传id
        _competition.getCategory().then(res => {
            this.setState({
                firstCategoryList: res
            });
        }, err => {
            alert(err.msg || '哪里不对了~');
        });
    },
    // 加载二级分类
    loadSecondCategory(){
        // 一级品类不存在时，不初始化二级分类
        if(!this.state.firstCategoryId){
            return;
        }
        // 查询一级品类时，不传id
        _competition.getCategory(this.state.firstCategoryId).then(res => {
            this.setState({
                secondCategoryList: res
            });
        }, err => {
            alert(err.msg || '哪里不对了~');
        });
    },
    // 编辑的时候，需要初始化比赛信息
    loadCompetition(){
        // 有id参数时，读取比赛信息
        if(this.state.id){
            // 查询一级品类时，不传id
            _competition.getCompetition(this.state.id).then(res => {
                let competition = this.competitionAdapter(res)
                this.setState(competition);
                // 有二级分类时，load二级列表
                if(competition.firstCategoryId){
                    this.loadSecondCategory();
                }
                this.refs['rich-editor'].setValue(competition.detail);
            }, err => {
                alert(err.msg || '哪里不对了~');
            });
        }
    },
    // 适配接口返回的数据
    competitionAdapter(competition){
        // 如果父品类是0（根品类），则categoryId作为一级品类
        let firstCategoryId     = competition.parentCategoryId === 0 ? competition.categoryId : competition.parentCategoryId,
            secondCategoryId    = competition.parentCategoryId === 0 ? '' : competition.categoryId;
        return {
            categoryId          : competition.categoryId,
            name                : competition.name,
            subtitle            : competition.subtitle,
            subImages           : competition.subImages.split(','),
            detail              : competition.detail,
            price               : competition.price,
            stock               : competition.stock,
            firstCategoryId     : firstCategoryId,
            secondCategoryId    : secondCategoryId,
            status              : competition.status
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
    // 一级品类变化
    onFirstCategoryChange(e){
        let newValue    = e.target.value || 0;
        // 更新一级选中值，并清除二级选中值
        this.setState({
            firstCategoryId     : newValue,
            secondCategoryId    : 0,
            secondCategoryList  : []
        }, () => {
            // 更新二级品类列表
            this.loadSecondCategory();
        });
    },
    // 二级品类变化
    onSecondCategoryChange(e){
        let newValue    = e.target.value;
        // 更新二级选中值
        this.setState({
            secondCategoryId    : newValue
        });
    },

    // 图片上传成功
    onUploadSuccess(res){
        let subImages = this.state.subImages;
        subImages.push(res.data.uri);
        this.setState({
            subImages: subImages
        });
    },
    // 图片上传失败
    onUploadError(err){
        alert(err.message || '哪里不对了~');
    },
    // 删除图片
    onDeleteImage(img){
        let subImages   = this.state.subImages,
            imageIndex  = subImages.indexOf(img);
        if(imageIndex >= 0){
            subImages.splice(imageIndex, 1);
        }
        this.setState({
            subImages: subImages
        });
    },
    // 验证要提交的产品信息是否符合规范
    checkCompetition(competition){
        let result = {
            status  : true,
            msg     : '验证通过'
        };
        if(!competition.name){
            result = {
                status  : false,
                msg     : '请输入比赛名称'
            }
        }
        if(!competition.subtitle){
            result = {
                status  : false,
                msg     : '请输入比赛描述'
            }
        }
        if(!competition.price){
            result = {
                status  : false,
                msg     : '请输入比赛价格'
            }
        }
        if(!competition.subtitle){
            result = {
                status  : false,
                msg     : '请输入比赛描述'
            }
        }
        return result;
    },
    // 提交表单
    onSubmit(e){
        // 阻止提交
        e.preventDefault();
        // 需要提交的字段
        let competition = {
                categoryId          : this.state.secondCategoryId || this.state.firstCategoryId || 0,
                name                : this.state.name,
                subtitle            : this.state.subtitle,
                subImages           : this.state.subImages.join(','),
                detail              : this.state.detail,
                price               : this.state.price,
                stock               : this.state.stock,
                status              : this.state.status || 0 // 状态为正常
            },
            checkCompetition = this.checkCompetition(competition);
        // 当为编辑时，添加id字段
        if(this.state.id){
            competition.id = this.state.id;
        }
        // 验证通过后，提交比赛信息
        if(checkCompetition.status){
            // 保存competition
            _competition.saveCompetition(competition).then(res => {
                alert(res);
                window.location.href = '#/competition/index';
            }, err => {
                alert(err.msg || '哪里不对了~');
            });
        }else{
            alert(checkCompetition.msg);
        }
        return false;
    },
    render() {
        return (
            <div id="page-wrapper">
                <PageTitle pageTitle={'比赛管理 -- ' + (this.state.id ? '修改比赛' : '添加比赛')}/>
                <div className="row">
                    <div className="form-wrap col-lg-12">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-2 control-label">比赛名称</label>
                                <div className="col-md-5">
                                    <input type="text" 
                                        className="form-control"
                                        name="name"
                                        id="name"
                                        placeholder="请输入比赛名称"
                                        value={this.state.name}
                                        onChange={this.onValueChange}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="subtitle" className="col-md-2 control-label">比赛描述</label>
                                <div className="col-md-5">
                                    <input type="text"
                                        className="form-control"
                                        name="subtitle"
                                        id="subtitle"
                                        placeholder="请输入比赛描述"
                                        value={this.state.subtitle}
                                        onChange={this.onValueChange}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="" className="col-md-2 control-label">所属分类</label>
                                <div className="col-md-10">
                                    <select type="password" className="form-control cate-select col-md-5" value={this.state.firstCategoryId} onChange={this.onFirstCategoryChange}>
                                        <option value="">请选择一级品类</option>
                                        {
                                            this.state.firstCategoryList.map((category, index) => {
                                                return (
                                                    <option value={category.id} key={index}>{category.name}</option>
                                                );
                                            })
                                        }
                                    </select>
                                    {this.state.secondCategoryList.length ?  
                                        <select type="password" className="form-control cate-select col-md-5" value={this.state.secondCategoryId} onChange={this.onSecondCategoryChange}>
                                            <option value="">请选择二级品类</option>
                                            {
                                                this.state.secondCategoryList.map((category, index) => {
                                                    return (
                                                        <option value={category.id} key={index}>{category.name}</option>
                                                    );
                                                })
                                            }
                                        </select> : null
                                    }
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="price" className="col-md-2 control-label">比赛价格</label>
                                <div className="col-md-3">
                                    <div className="input-group">
                                        <input type="number" 
                                            className="form-control" 
                                            id="price" 
                                            placeholder="价格"
                                            name="price"
                                            value={this.state.price}
                                            onChange={this.onValueChange}/>
                                        <div className="input-group-addon">元</div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="stock" className="col-md-2 control-label">比赛库存</label>
                                <div className="col-md-3">
                                    <div className="input-group">
                                        <input type="number" 
                                            className="form-control" 
                                            id="stock" 
                                            name="stock"
                                            placeholder="库存" 
                                            value={this.state.stock}
                                            onChange={this.onValueChange}/>
                                        <div className="input-group-addon">件</div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputEmail3" className="col-md-2 control-label">比赛图片</label>
                                <div className="img-con col-md-10">
                                    {
                                        this.state.subImages.length ? this.state.subImages.map((image, index) => {
                                            return (
                                                <div className="sub-img" key={index}>
                                                    <img className="img" src={_mm.getImageUrl(image)}/>
                                                    <i className="fa fa-close fa-fw" onClick={this.onDeleteImage.bind(this, image)}></i>
                                                </div>
                                            );
                                        }) : <div className="notice">请上传图片</div>
                                    }
                                </div>
                                <div className="col-md-offset-2 col-md-10">
                                    <FileUploader onSuccess={this.onUploadSuccess} onError={this.onUploadError}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputEmail3" className="col-md-2 control-label">比赛详情</label>
                                <div className="col-md-10">
                                    <RichEditor ref="rich-editor" onValueChange={this.onRichValueChange} placeholder="比赛详细信息"/>
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

export default CompetitionSave;
