
'use strict';
import MMUtile from 'util/mm.jsx';

const _mm = new MMUtile();

export default class Code{
    
    // 获取比赛信息
    getCodeList(listParam){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/code/list.do'),
            data    : {
                pageNum         : listParam.pageNum || 1,
                competitionId   : listParam.competitionId
            }
        });
    }
}
