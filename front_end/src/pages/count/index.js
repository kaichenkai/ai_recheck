import { connect } from "dva";
import React, { Component, Fragment } from "react";
import { Card, Button, Row, Col, Form, DatePicker, Divider, Select } from 'antd';
import moment from "moment";
import Link from "umi/link";
import { routerRedux } from "dva";

import DataTable from "../../components/dataTable";
import Download from "../../components/download";
import styles from './index.css';

const RangePicker = DatePicker.RangePicker;
const { Option } = Select;

const manual_check_status = [{ name: "全部", value: 3 }, { name: "正片", value: 1 }, { name: "废片", value: 2 }]
const rangeConfig = {
  rules: [{ type: 'array' }],
  initialValue: [moment().startOf('day').subtract(1, "days"), moment().endOf('day').subtract(1, "days")]
};

const TimeSelect = ({ form, onSubmit }) => (
  <Form className={styles.timePickerForm} onSubmit={(e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        onSubmit(values)
      }
    });
  }} >
    <Form.Item label="录入时间">
      {form.getFieldDecorator('time_range', rangeConfig)(
        <RangePicker className={styles.timePicker} showTime format="YYYY-MM-DD HH:mm:ss" />,
      )}
    </Form.Item>
    <Form.Item label="审核状态">
      {form.getFieldDecorator('manual_check_status', {
        initialValue: 3
      })(
        <Select>
          {manual_check_status.map(item => <Option key={item.value} value={item.value}>{item.name}</Option>)}
        </Select>,
      )}
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit" className={styles.timePickerFormButton} >
        确定
      </Button>
    </Form.Item>
  </Form>
)

const TimeSelectForm = Form.create({ name: 'TimeSelectForm' })(TimeSelect);

@connect(({ loading, count }) => ({
  data: count,
  loadingData: loading.effects['count/fetch'],
}))
class Count extends Component {
  state = {
    filters: {
      start_time: rangeConfig.initialValue[0].format("YYYY-MM-DD HH:mm:ss"),
      end_time: rangeConfig.initialValue[1].format("YYYY-MM-DD HH:mm:ss"),
      manual_check_status: 3,
    },
  }

  columns = [
    {
      title: '编号',
      width: '6%',
      render: (text, row, index) => row.name === "总计" ? "" : index + 1,
    },
    {
      title: '采集机关',
      dataIndex: 'name',
      // width: '16%',
      render: text => String(text)
    },
    {
      title: '录入量',
      dataIndex: 'insert_count',
      width: '8%',
      // sorter: true
    },
    {
      title: '分析量',
      dataIndex: 'ana_count',
      width: '8%',
      // sorter: true
    },
    // 新增加, 上报量
    {
      title: '上报量',
      dataIndex: 'report_count',
      width: '8%',
      // sorter: true
    },

    {
      title: '疑似错误量',
      dataIndex: 'err_count',
      width: '8%',
      render: (text, row, index) => row.name === "总计" ? (
        <span style={{ padding: "0 15px" }}>{text}</span>
      ) : (
          <Button type="link" onClick={() => {
            const { filters: { start_time, end_time } } = this.state;
            this.props.dispatch(routerRedux.push({
              pathname: `/count/detail`,
              state: {
                name: row.name,
                start_time,
                end_time
              }
            }))
          }}>{text}</Button>
        ),
      // sorter: true,
    },
    {
      title: '正片量',
      dataIndex: 'm1_count',
      width: '8%',
    },
    {
      title: '废片量',
      dataIndex: 'm2_count',
      width: '8%',
    },
    {
      title: '准确率',
      dataIndex: 'm2_p',
      width: '10%',
    },
    {
      title: '召回率',
      dataIndex: 'recall',
      width: '10%',
    },
    {
      title: '检出率',
      dataIndex: 'jianchu',
      width: '10%',
    },
  ];

  componentDidMount() {
    this.queryData({
      page: 1,
      pageSize: 48
    })
  }

  queryData(data) {
    return this.props.dispatch({
      type: 'count/fetch',
      payload: {
        data: {
          pageSize: data.pageSize,
          current: (data.page - 1) * data.pageSize,
          ...this.state.filters,
        },
      },
    });
  }


  onChangePage = (page, pageSize) => {
    this.queryData({
      page,
      pageSize,
      simple: true,

    })
  }

  onChangePageSize = (current, size) => {
    this.queryData({
      page: 1,
      pageSize: size,
      simple: true,

    })
  }

  timeSelectSubmit = (values) => {
    let filters = {
      start_time: values.time_range && values.time_range.length === 2 ? values.time_range[0].format("YYYY-MM-DD HH:mm:ss") : undefined,
      end_time: values.time_range && values.time_range.length === 2 ? values.time_range[1].format("YYYY-MM-DD HH:mm:ss") : undefined,
      manual_check_status: values.manual_check_status
    }
    const { data } = this.props
    this.setState({
      filters,
    }, () => {
      this.queryData({
        page: 1,
        pageSize: data.pageSize,
      })
    })
  }

  render() {
    const { data, loadingData } = this.props;
    const { filters } = this.state;

    return (
      <Fragment>
        <Card
          title="通报统计"
          extra={
            <span>
              <Download url="/api/get/create/results/info" filter={filters} name="导出废片" />
              <Divider type="vertical" />
              <Download url="/api/get/create/results" filter={filters} name="导出统计" />
              <Divider type="vertical" />
              <Link to="/">返回主页</Link>
            </span>
          }
        >
          <Row>
            <Col span={6}>
              <Row type="flex" justify="space-around">
                <Col>
                  <TimeSelectForm onSubmit={this.timeSelectSubmit} />
                </Col>
              </Row>
            </Col>
            <Col span={18}>
              <DataTable
                rowKey="name"
                data={data.items}
                time_total={false}
                current={data.page}
                pageSize={data.pageSize}
                total={data.total}
                onShowSizeChange={this.onChangePageSize}
                onChange={this.onChangePage}
                loading={loadingData}
                columns={this.columns}
              // onTableChange={(_, __, sorter) => { console.log(sorter); }}
              />
            </Col>
          </Row>
        </Card>
      </Fragment>
    )
  }
}

export default Count;
