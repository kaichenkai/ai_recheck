import Zmage from 'react-zmage';
import { Row, Col, Button, message } from "antd";

import styles from "./imageBrowser.css";
import { detect_result, manual_check_status } from "../utils/config";
import request, { parseResponseData } from "../utils/request";
import { Fragment } from 'react';

const getDiffChars = (good, err) => {
  let ret = []
  for(let i = 0; i < Math.max(good.length, err.length); i++){
    if(good[i] !== err[i]){
      ret.push(i)
    }
  }
  return ret
}

const MarkText = ({markChars, text}) => (
  <Fragment>{text.split("").map((e, i) => markChars.includes(i) ? <span key={i} style={{color: "red"}}>{e}</span> : e)}</Fragment>
)

const ImageBrowser = ({ info, nextImage, prevImage, hasNotNext, hasNotPrev, reloadData }) => {
  const dc = getDiffChars(info.row.src_car_plate_number, info.row.sdk_car_plate_number)
  return (
    <Row>
      <Col span={18} className={styles.imageBox}>
        <Zmage className={styles.img} src={`/api/show/image/${info.row.id}`} alt="" />
        <Button onClick={prevImage} className={styles.left} disabled={hasNotPrev} >上一条</Button>
        <Button onClick={nextImage} className={styles.right} disabled={hasNotNext} >下一条</Button>
      </Col>
      <Col span={5} offset={1} className={styles.infoBox}>
        <p><b>原始信息</b></p>
        <p>号牌号码：<MarkText markChars={dc} text={info.row.src_car_plate_number} /></p>
        <p>录入时间：{info.row.data_entry_time}</p>
        <p>违法行为：{info.row.src_illegal_action}</p>
        <p><b>识别信息</b></p>
        <p>号牌号码：<MarkText markChars={dc} text={info.row.sdk_car_plate_number} /></p>
        <p>识别结果：{detect_result[info.row.sdk_reason_code - 1]}</p>
        <p>提取号牌：<br />
          <img style={{ width: 200 }} src={`/api/show/image/${info.row.id}?box=${
            info.row.sdk_plate_rect.slice(1, info.row.sdk_plate_rect.indexOf("]"))
            }`} alt="" />
        </p>
        <div>
          字段得分:
          <table border="1">
            <tbody>
              <tr>{info.row.sdk_car_plate_number.split("").map((e, i) => <td key={i} style={dc.includes(i) ? {
                border: "1px solid red",
                color: "red"
              } : {}}>{e}</td>)}</tr>
              <tr>{info.row.plate_scores.map((e, i) => <td key={i}>{e}</td>)}</tr>
            </tbody>
          </table>
          <p></p>
        </div>
        <p>审核结果：{manual_check_status[info.row.manual_check_status]}</p>
        <Button onClick={() => {
          request(`/api/update/manual/status`, {
            method: 'patch',
            data: {
              ids: [info.row.id],
              manual_check_status: 1,
            },
          }).then(res => {
            if (parseResponseData(res)) {
              message.success('操作成功');
              // 这里做局部刷新
              reloadData(true)
            }
          })
        }} type="primary" block style={{ marginBottom: 10 }}>正片</Button>
        <Button onClick={() => {
          request(`/api/update/manual/status`, {
            method: 'patch',
            data: {
              ids: [info.row.id],
              manual_check_status: 2,
            },
          }).then(res => {
            if (parseResponseData(res)) {
              message.success('操作成功');
              // 这里做局部刷新
              reloadData(true)
            }
          })
        }} block>废片</Button>
      </Col>
    </Row>
  )
}

export default ImageBrowser;
