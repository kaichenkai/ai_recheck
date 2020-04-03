import { queryCountDetailData } from "@/services/data";
import { parseResponseData } from "@/utils/request";

export default {
  namespace: 'countDetail',
  state: {
    items: [],
    total: 0,
    page: 1,
    pageSize: 24,
  },
  effects: {
    *fetch({ payload: { data } }, { call, put }) {
      const res = yield call(queryCountDetailData, data);
      if(parseResponseData(res)){
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