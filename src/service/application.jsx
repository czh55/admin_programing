'use strict';

import MMUtile from 'util/mm.jsx';

const _mm = new MMUtile();

export default class Application{
    // 获取报名列表
    getApplicationList(listParam){
        if(listParam.listType == 'list'){
            return _mm.request({
                url     : _mm.getServerUrl('/manage/application/list.do'),
                data    : {
                    pageNum : listParam.pageNum || 1
                }
            });
        }
        else if(listParam.listType == 'search'){
            return _mm.request({
                url     : _mm.getServerUrl('/manage/application/search.do'),
                data    : listParam
            });
        } 
    }
    // 获取报名详情
    getApplicationDetail(applicationNo){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/application/detail.do'),
            data    : {
                applicationNo : applicationNo || 0
            }
        });
    }
}