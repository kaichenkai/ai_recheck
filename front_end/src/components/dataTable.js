import { Table, Pagination } from "antd";

// 对比结果查询, 右侧数据表格
const DataTable = ({ data, time_total, total, current, loading, pageSize, onShowSizeChange, onChange, columns, rowKey, onTableChange }) => {
  return (
    <div style={{
      textAlign: "center"
    }}>
      <Table
        rowKey={rowKey}
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        size="small"
        scroll={{ y: document.body.clientHeight - 224 }}
        style={{
          height: document.body.clientHeight - 186
        }}
        onChange={onTableChange}
      />
      {time_total === false ? null : <p>筛选时间段总条数: {time_total}</p>}
      <Pagination
        style={{
          marginTop: 14,
        }}
        showSizeChanger
        showQuickJumper
        showTotal={(total, range) =>  "共" + total + "条"}
        total={total}
        current={current}
        onChange={onChange}
        pageSizeOptions={["12", "24", "48"]}
        pageSize={pageSize}
        onShowSizeChange={onShowSizeChange}
      />
    </div>
  )
}

export default DataTable;
