import request from "../utils/request";

export async function queryData(data) {
  return request(`/api/results`, {
  // return request(`http://10.56.82.213:8088/api/results`, {
    method: 'post',
    data,
  });
}

export async function queryCountData(data) {
  return request(`/api/create/results`, {
  // return request(`http://10.56.82.213:8088/api/create/results`, {
    method: 'post',
    data,
  });
}

export async function queryCountDetailData(data) {
  return request(`/api/create/results/info`, {
  // return request(`http://10.56.82.213:8088/api/create/results/info`, {
    method: 'post',
    data,
  });
}
