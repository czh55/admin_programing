
'use strict';
import MMUtile from 'util/mm.jsx';

const _mm = new MMUtile();

export default class Result{
    
    // 获取结果信息
    getResult(competitionId){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/result/detail.do'),
            data    : {
                competitionId : competitionId || 0
            }
        });
    }

    // 保存结果信息
    saveResult(result){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/result/save.do'),
            data    : result
        });
    }
    
}
