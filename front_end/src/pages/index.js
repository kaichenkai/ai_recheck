import { connect } from "dva";
import React, { Component, Fragment } from "react";
import { Card, Button, Row, Col, DatePicker, Form, Select, message, Divider, Input } from 'antd';
import moment from "moment";
import Link from 'umi/link';

import request, { parseResponseData } from "../utils/request";
import DataTable from "../components/dataTable";
import Download from "../components/download";
import styles from './index.css';
import { detect_result, manual_check_status } from "../utils/config";
import ImageBrowserModal from "../components/imageBrowserModal";

const RangePicker = DatePicker.RangePicker;
const { Option } = Select;

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
    <Form.Item label="识别时间">
      {form.getFieldDecorator('recog_time_range', {
        rules: [{ type: 'array' }],
        initialValue: []
      })(
        <RangePicker className={styles.timePicker} showTime format="YYYY-MM-DD HH:mm:ss" />,
      )}
    </Form.Item>
    <Form.Item label="类型">
      {form.getFieldDecorator('types', {
        rules: [{ type: 'array' }]
      })(
        <Select mode="multiple" allowClear>
          {detect_result.map((v, i) => <Option key={i} value={i + 1}>{v}</Option>)}
        </Select>,
      )}
    </Form.Item>
    <Form.Item label="审核状态">
      {form.getFieldDecorator('manual_check_status', {
        rules: [{ type: 'array' }]
      })(
        <Select mode="multiple" allowClear>
          {manual_check_status.map((v, i) => <Option key={i} value={i}>{v}</Option>)}
        </Select>,
      )}
    </Form.Item>
    <Form.Item label="违法行为">
      {form.getFieldDecorator('action', {
        rules: [{ type: 'string' }]
      })(
        <Input />
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

@connect(({ loading, data }) => ({
  data: data,
  loadingData: loading.effects['data/fetch'],
}))
class Demo extends Component {
  state = {
    showImageModal: false,
    info: {},
    filters: {
      start_time: rangeConfig.initialValue[0].format("YYYY-MM-DD HH:mm:ss"),
      end_time: rangeConfig.initialValue[1].format("YYYY-MM-DD HH:mm:ss"),
      recog_start_time: 0,
      recog_end_time: 0,
      reason_code: [],
      manual_check_status: [],
      action: "",
    },
  };

  columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: '10%',
    },
    {
      title: '录入时间',
      dataIndex: 'data_entry_time',
      width: '15%',
    },
    {
      title: '识别时间',
      dataIndex: 'sdk_recog_time',
      width: '15%',
      render: (text, row, index) => (
        moment(text).format("YYYY-MM-DD HH:mm:ss")
      ),
    },
    {
      title: '识别号牌号码',
      dataIndex: 'sdk_car_plate_number',
      width: '15%',
    },
    {
      title: '原始号牌号码',
      dataIndex: 'src_car_plate_number',
      width: '15%',
    },
    {
      title: '识别结果',
      dataIndex: 'sdk_reason_code',
      render: (text, row, index) => (
        detect_result[text - 1]
      ),
      width: '10%',
    },
    {
      title: '审核状态',
      dataIndex: 'manual_check_status',
      render: (text, row, index) => (
        manual_check_status[text]
      ),
      width: '10%',
    },
    {
      title: '操作',
      render: (text, row, index) => (
        <Button onClick={() => this.showImage(row, index)}>
          查看图片
        </Button>
      ),
      width: '10%',
    },
  ];

  componentDidMount() {
    this.queryData({
      page: 1,
      pageSize: 24
    })
  }

  queryData(data) {
    return this.props.dispatch({
      type: 'data/fetch',
      payload: {
        data: {
          pageSize: data.pageSize,
          current: (data.page - 1) * data.pageSize,
          simple: data.simple ? true : false,
          ...this.state.filters,
        },
      },
    });
  }

  reloadData = (simple = false) => {
    const id = this.state.info.row.id
    this.queryData({
      pageSize: this.props.data.pageSize,
      page: this.props.data.page,
      simple,
      ...this.state.filters,
    }).then(() => {
      if (this.props.data.items.length <= this.state.info.index) {
        this.setState({
          showImageModal: false
        })
      } else {
        const index = this.state.info.index
        const row = this.props.data.items[index]
        this.setState({
          info: {
            index,
            row,
          }
        })
        const { total, pageSize, page } = this.props.data
        const hasNotNext = Math.ceil(total / pageSize) === page && index === total % pageSize - 1
        if (id === row.id && !hasNotNext) {
          this.nextImage()
          return
        } else if (id === row.id && hasNotNext) {
          this.setState({
            showImageModal: false
          })
        }
        this.setState({ info: { index, row } })
      }
    })
  }

  showImage = (row, index) => {
    this.setState({
      showImageModal: true,
      info: {
        index,
        row,
      }
    })
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

  nextImage = () => {
    const { index } = this.state.info;
    const { data } = this.props
    if (data.items.length === index + 1) {
      this.queryData({
        page: data.page + 1,
        pageSize: data.pageSize,
      }).then(() => {
        const { data } = this.props
        this.setState({
          info: {
            index: 0,
            row: data.items[0],
          }
        })
      })

      return
    }
    this.setState({
      info: {
        index: index + 1,
        row: data.items[index + 1],
      }
    })
  }

  prevImage = () => {
    const { index } = this.state.info;
    const { data } = this.props
    if (index === 0) {
      this.queryData({
        page: data.page - 1,
        pageSize: data.pageSize,
      }).then(() => {
        const { data } = this.props
        this.setState({
          info: {
            index: data.items.length - 1,
            row: data.items[data.items.length - 1],
          }
        })
      })

      return
    }
    this.setState({
      info: {
        index: index - 1,
        row: data.items[index - 1],
      }
    })
  }

  timeSelectSubmit = (values) => {
    let filters = {
      start_time: values.time_range && values.time_range.length === 2 ? moment(values.time_range[0]).format("YYYY-MM-DD HH:mm:ss") : undefined,
      end_time: values.time_range && values.time_range.length === 2 ? moment(values.time_range[1]).format("YYYY-MM-DD HH:mm:ss") : undefined,
      recog_start_time: values.recog_time_range && values.recog_time_range.length === 2 ? Math.round(values.recog_time_range[0].valueOf()) : 0,
      recog_end_time: values.recog_time_range && values.recog_time_range.length === 2 ? Math.round(values.recog_time_range[1].valueOf()) : 0,
      reason_code: values.types ? values.types.map(e => parseInt(e)) : [],
      manual_check_status: values.manual_check_status ? values.manual_check_status : [],
      action: values.action || ""
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

  pauseJob = () => {
    request(`/pause/job`, {
      method: 'get',
    }).then(res => {
      if (parseResponseData(res)) {
        message.success('操作成功');
      }
    })
  }

  restartJob = () => {
    request(`/restart/job`, {
      method: 'get',
    }).then(res => {
      if (parseResponseData(res)) {
        message.success('操作成功');
      }
    })
  }

  render() {
    const { data, loadingData } = this.props;
    const { showImageModal, info, filters } = this.state;

    return (
      <Fragment>
        <Card
          title="对比结果查询"
          extra={
            <span>
              <Download url="/api/download/result" filter={filters} />
              <Divider type="vertical" />
              <Link to="/count">通报统计</Link>
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
              <Row type="flex" justify="space-around">
                <Col>
                  <Button onClick={this.pauseJob}>暂停分析</Button>
                </Col>
                <Col>
                  <Button onClick={this.restartJob}>恢复分析</Button>
                </Col>
              </Row>
            </Col>
            <Col span={18} className={styles.tableContainer}>
              <DataTable
                rowKey={(record => record.id)}
                data={data.items}
                time_total={data.time_total}
                current={data.page}
                pageSize={data.pageSize}
                total={data.total}
                onShowSizeChange={this.onChangePageSize}
                onChange={this.onChangePage}
                loading={loadingData}
                columns={this.columns}
              />
            </Col>
          </Row>
        </Card>
        <ImageBrowserModal
          showImageModal={showImageModal}
          reloadData={this.reloadData}
          nextImage={this.nextImage}
          prevImage={this.prevImage}
          data={data}
          info={info}
          onCancel={() => this.setState({ showImageModal: false })}
        />
      </Fragment>
    )
  }
}

export default Demo;
