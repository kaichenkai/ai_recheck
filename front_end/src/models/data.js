import { queryData } from "../services/data";
import { parseResponseData } from "../utils/request";

export default {
  namespace: 'data',
  state: {
    items: [],
    time_total: 0,
    total: 0,
    page: 1,
    pageSize: 24,
  },
  effects: {
    *fetch({ payload: { data } }, { call, put }) {
      const res = yield call(queryData, data);
      if(parseResponseData(res)){
        yield put({
          type: 'save',
          payload: {
            items: res.data.result || [],
            time_total: res.data.time_total,
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
        time_total: 0,
        total: 0,
        page: 1,
        pageSize: 24,
      }
    },
  },
};