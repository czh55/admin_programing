
'use strict';
import MMUtile from 'util/mm.jsx';

const _mm = new MMUtile();

export default class Competition{
    
    // 获取比赛信息
    getCompetition(competitionId){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/competition/detail.do'),
            data    : {
                competitionId : competitionId || 0
            }
        });
    }
    // 获取比赛信息
    getCompetitionList(listParam){
        if(listParam.listType == 'list'){
            return _mm.request({
                url     : _mm.getServerUrl('/manage/competition/list.do'),
                data    : {
                    pageNum : listParam.pageNum || 1
                }
            });
        }
        else if(listParam.listType == 'search'){
            return _mm.request({
                url     : _mm.getServerUrl('/manage/competition/search.do'),
                data    : listParam
            });
        }
            
    }
    // 获取比赛信息
    saveCompetition(competition){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/competition/save.do'),
            data    : competition
        });
    }
    // 改变比赛状态
    setCompetitionStatus(competitionId, status){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/competition/set_sale_status.do'),
            data    : {
                competitionId   : competitionId,
                status      : status
            }
        });
    }
    // 获取品类
    getCategory(parentCategoryId){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/category/get_category.do'),
            data    : {
                categoryId : parentCategoryId || 0
            }
        });
    }
    // 新增品类
    saveCategory(category){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/category/add_category.do'),
            data    : {
                parentId        : category.parentId    || 0,
                categoryName    : category.categoryName  || ''
            }
        });
    }
    // 更新品类名称
    updateCategoryName(category){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/category/set_category_name.do'),
            data    : category
        });
    }
}
