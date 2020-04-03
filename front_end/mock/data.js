const items = [...new Array(1000)].map((e, i) => ({
  number: i,
  time: "123",
  result_plate: "123",
  origin_plate: "123",
}))

export default {
  // 支持值为 Object 和 Array
  'GET /api/data': (req, res) => {
    let {page, pageSize} = req.query;
    page = parseInt(page);
    pageSize = parseInt(pageSize);

    res.send({
      code: 0,
      data: {
        items: items.slice((page-1)*pageSize, page*pageSize),
        total: items.length,
        page: page,
        pageSize: pageSize,
      },
      message: "sucess"
    })
  },
};