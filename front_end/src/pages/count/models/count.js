import { queryCountData } from "@/services/data";
import { parseResponseData } from "@/utils/request";

export default {
  namespace: 'count',
  state: {
    items: [],
    total: 0,
    page: 1,
    pageSize: 48,
  },
  effects: {
    *fetch({ payload: { data } }, { call, put }) {
      const res = yield call(queryCountData, data);
      if(parseResponseData(res)){
        const total = {
          name: "总计",
          insert_count: res.data.inserts || 0,
          err_count: res.data.errs || 0,
          m1_count: res.data.m1s || 0,
          m2_count: res.data.m2s || 0,
          m2_p: res.data.m2_p || "0%",
          recall: res.data.recall || "0%",
          jianchu: res.data.jianchu || "0%",
          ana_count: res.data.ana_counts || 0,  // 分析量
          report_count: res.data.report_total || 0  // 上报量
        }
        let items = res.data.result || []
        if(items.length){
          items.push(total)
        }
        yield put({
          type: 'save',
          payload: {
            items: res.data.result || [],
            total: res.total,
            page: Math.ceil((res.current + 1) / res.pageSize),
            pageSize: res.pageSize,
          },
        });
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return payload || {
        items: [],
        total: 0,
        page: 1,
        pageSize: 24,
      }
    },
  },
};
