import { connect } from "dva";
import React, { Component, Fragment } from "react";
import { Card, Button, Row, Col, Form, DatePicker, Select, Divider } from 'antd';
import moment from "moment";
import Link from "umi/link";

import DataTable from "../../components/dataTable";
import Download from "../../components/download";
import ImageBrowserModal from "../../components/imageBrowserModal";
import LongText from "../../components/LongText";
import styles from './index.css';
import { detect_result, manual_check_status } from "../../utils/config";

const RangePicker = DatePicker.RangePicker;
const { Option } = Select;

const TimeSelect = ({ form, onSubmit, initVals: { time_range } }) => (
  <Form className={styles.timePickerForm} onSubmit={(e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        onSubmit(values)
      }
    });
  }} >
    <Form.Item label="录入时间">
      {form.getFieldDecorator('time_range', {
        rules: [{ type: 'array' }],
        initialValue: time_range
      })(
        <RangePicker className={styles.timePicker} showTime format="YYYY-MM-DD HH:mm:ss" />,
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
    <Form.Item>
      <Button type="primary" htmlType="submit" className={styles.timePickerFormButton} >
        确定
      </Button>
    </Form.Item>
  </Form>
)

const TimeSelectForm = Form.create({ name: 'TimeSelectForm' })(TimeSelect);

@connect(({ loading, countDetail }) => ({
  data: countDetail,
  loadingData: loading.effects['countDetail/fetch'],
}))
class CountDetail extends Component {
  constructor(props) {
    super(props)
    const { start_time, end_time } = this.props.location.state || {}
    this.state = {
      showImageModal: false,
      info: {},
      filters: {
        start_time,
        end_time,
        manual_check_status: []
      },
    }
    this.columns = [
      {
        title: '编号',
        dataIndex: 'id',
        width: '4%',
      },
      {
        title: '违法ID',
        dataIndex: 'src_record_id',
        width: '13%',
        render: (text) => <LongText text={text} max={20} />
      },
      {
        title: '采集机关',
        render: () => <LongText text={this.props.location.state && this.props.location.state.name} max={12} />,
        width: '15%',
      },
      {
        title: '录入人',
        dataIndex: 'data_entry_person',
        width: '8%',
      },
      {
        title: '录入时间',
        dataIndex: 'data_entry_time',
        width: '12%',
      },
      {
        title: '违法代码',
        dataIndex: 'src_illegal_action',
        width: '%6',
      },
      {
        title: '识别号牌号码',
        dataIndex: 'sdk_car_plate_number',
        width: '8%',
      },
      {
        title: '原始号牌号码',
        dataIndex: 'src_car_plate_number',
        width: '8%',
      },
      {
        title: '识别结果',
        dataIndex: 'sdk_reason_code',
        render: (text) => (
          detect_result[text - 1]
        ),
        width: '7%',
      },
      {
        title: '审核结果',
        dataIndex: 'manual_check_status',
        render: (text) => (
          manual_check_status[text]
        ),
        width: '6%',
      },
      {
        title: '操作',
        render: (_, row, index) => (
          <Button onClick={() => this.showImage(row, index)}>
            查看图片
          </Button>
        ),
        width: '10%',
      },
    ];
  }

  componentDidMount() {
    this.queryData({
      page: 1,
      pageSize: 24,
    })
  }

  queryData(data) {
    const { name } = this.props.location.state || { name: "" }
    return this.props.dispatch({
      type: 'countDetail/fetch',
      payload: {
        data: {
          pageSize: data.pageSize,
          current: (data.page - 1) * data.pageSize,
          name: name,
          simple: data.simple ? true : false,
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
      manual_check_status: values.manual_check_status ? values.manual_check_status : [],
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

  nextImage = () => {
    const { index } = this.state.info;
    const { data } = this.props
    if (data.items.length === index + 1) {
      this.queryData({
        page: data.page + 1,
        pageSize: data.pageSize,
      }).then(() => {
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

  render() {
    const { showImageModal, info, filters } = this.state;
    const { data, loadingData, location: { state = {} } } = this.props;
    const { name } = state;

    return (
      <Fragment>
        <Card
          title="通报统计"
          extra={
            <span>
              <Download url="/api/get/create/results/info" filter={{ ...filters, name }} />
              <Divider type="vertical" />
              <Link to="/count">返回</Link>
            </span>
          }
        >
          <Row>
            <Col span={6}>
              <Row type="flex" justify="space-around">
                <Col>
                  <TimeSelectForm onSubmit={this.timeSelectSubmit} initVals={{
                    time_range: !filters.start_time || !filters.end_time ? [] : [
                      moment(filters.start_time),
                      moment(filters.end_time)
                    ]
                  }} />
                </Col>
              </Row>
            </Col>
            <Col span={18}>
              <DataTable
                rowKey={(record => record.id)}
                data={data.items}
                time_total={false}
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

export default CountDetail;
