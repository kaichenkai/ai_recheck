(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[2],{"4q7P":function(e,t,a){"use strict";a("DjyN");var n=a("NUBc"),r=(a("g9YV"),a("wCAj")),i=a("q1tI"),l=a.n(i),o=function(e){var t=e.data,a=e.time_total,i=e.total,o=e.current,c=e.loading,m=e.pageSize,s=e.onShowSizeChange,u=e.onChange,d=e.columns,p=e.rowKey,g=e.onTableChange;return l.a.createElement("div",{style:{textAlign:"center"}},l.a.createElement(r["a"],{rowKey:p,columns:d,dataSource:t,loading:c,pagination:!1,size:"small",scroll:{y:document.body.clientHeight-224},style:{height:document.body.clientHeight-186},onChange:g}),!1===a?null:l.a.createElement("p",null,"\u7b5b\u9009\u65f6\u95f4\u6bb5\u603b\u6761\u6570: ",a),l.a.createElement(n["a"],{style:{marginTop:14},showSizeChanger:!0,showQuickJumper:!0,showTotal:function(e,t){return"\u5171"+e+"\u6761"},total:i,current:o,onChange:u,pageSizeOptions:["12","24","48"],pageSize:m,onShowSizeChange:s}))};t["a"]=o},Aeqt:function(e,t,a){"use strict";a.d(t,"a",function(){return n}),a.d(t,"b",function(){return r});var n=["\u8f66\u724c\u66f4\u6b63","\u7591\u4f3c","\u6a21\u7cca","\u906e\u6321","\u672a\u5339\u914d\u5230\u8f66"],r=["\u672a\u5ba1\u6838","\u6b63\u7247","\u5e9f\u7247"]},"S/iF":function(e,t,a){e.exports={timePickerForm:"timePickerForm___2L6ff",timePickerFormButton:"timePickerFormButton___2aJ-9",timePicker:"timePicker___1l_gL"}},YRlp:function(e,t,a){e.exports={imageBox:"imageBox___svO8q",left:"left___3SecU",right:"right___2j5VR",img:"img___3Z0B6"}},es13:function(e,t,a){"use strict";a("2qtc");var n=a("kLXV"),r=a("q1tI"),i=a.n(r),l=(a("14J3"),a("BMrR")),o=(a("miYZ"),a("tsqr")),c=(a("jCWc"),a("kPKH")),m=(a("+L6B"),a("2/Rp")),s=a("Py4S"),u=a.n(s),d=a("YRlp"),p=a.n(d),g=a("Aeqt"),h=a("t3Un"),f=function(e,t){for(var a=[],n=0;n<Math.max(e.length,t.length);n++)e[n]!==t[n]&&a.push(n);return a},_=function(e){var t=e.markChars,a=e.text;return i.a.createElement(r["Fragment"],null,a.split("").map(function(e,a){return t.includes(a)?i.a.createElement("span",{key:a,style:{color:"red"}},e):e}))},w=function(e){var t=e.info,a=e.nextImage,n=e.prevImage,r=e.hasNotNext,s=e.hasNotPrev,d=e.reloadData,w=f(t.row.src_car_plate_number,t.row.sdk_car_plate_number);return i.a.createElement(l["a"],null,i.a.createElement(c["a"],{span:18,className:p.a.imageBox},i.a.createElement(u.a,{className:p.a.img,src:"/api/show/image/".concat(t.row.id),alt:""}),i.a.createElement(m["a"],{onClick:n,className:p.a.left,disabled:s},"\u4e0a\u4e00\u6761"),i.a.createElement(m["a"],{onClick:a,className:p.a.right,disabled:r},"\u4e0b\u4e00\u6761")),i.a.createElement(c["a"],{span:5,offset:1,className:p.a.infoBox},i.a.createElement("p",null,i.a.createElement("b",null,"\u539f\u59cb\u4fe1\u606f")),i.a.createElement("p",null,"\u53f7\u724c\u53f7\u7801\uff1a",i.a.createElement(_,{markChars:w,text:t.row.src_car_plate_number})),i.a.createElement("p",null,"\u5f55\u5165\u65f6\u95f4\uff1a",t.row.data_entry_time),i.a.createElement("p",null,"\u8fdd\u6cd5\u884c\u4e3a\uff1a",t.row.src_illegal_action),i.a.createElement("p",null,i.a.createElement("b",null,"\u8bc6\u522b\u4fe1\u606f")),i.a.createElement("p",null,"\u53f7\u724c\u53f7\u7801\uff1a",i.a.createElement(_,{markChars:w,text:t.row.sdk_car_plate_number})),i.a.createElement("p",null,"\u8bc6\u522b\u7ed3\u679c\uff1a",g["a"][t.row.sdk_reason_code-1]),i.a.createElement("p",null,"\u63d0\u53d6\u53f7\u724c\uff1a",i.a.createElement("br",null),i.a.createElement("img",{style:{width:200},src:"/api/show/image/".concat(t.row.id,"?box=").concat(t.row.sdk_plate_rect.slice(1,t.row.sdk_plate_rect.indexOf("]"))),alt:""})),i.a.createElement("div",null,"\u5b57\u6bb5\u5f97\u5206:",i.a.createElement("table",{border:"1"},i.a.createElement("tbody",null,i.a.createElement("tr",null,t.row.sdk_car_plate_number.split("").map(function(e,t){return i.a.createElement("td",{key:t,style:w.includes(t)?{border:"1px solid red",color:"red"}:{}},e)})),i.a.createElement("tr",null,t.row.plate_scores.map(function(e,t){return i.a.createElement("td",{key:t},e)})))),i.a.createElement("p",null)),i.a.createElement("p",null,"\u5ba1\u6838\u7ed3\u679c\uff1a",g["b"][t.row.manual_check_status]),i.a.createElement(m["a"],{onClick:function(){Object(h["a"])("/api/update/manual/status",{method:"patch",data:{ids:[t.row.id],manual_check_status:1}}).then(function(e){Object(h["b"])(e)&&(o["a"].success("\u64cd\u4f5c\u6210\u529f"),d(!0))})},type:"primary",block:!0,style:{marginBottom:10}},"\u6b63\u7247"),i.a.createElement(m["a"],{onClick:function(){Object(h["a"])("/api/update/manual/status",{method:"patch",data:{ids:[t.row.id],manual_check_status:2}}).then(function(e){Object(h["b"])(e)&&(o["a"].success("\u64cd\u4f5c\u6210\u529f"),d(!0))})},block:!0},"\u5e9f\u7247")))},E=w,S=function(e){var t=e.showImageModal,a=e.reloadData,r=e.nextImage,l=e.prevImage,o=e.data,c=e.info,m=e.onCancel;return i.a.createElement(n["a"],{title:"\u67e5\u770b\u8be6\u60c5",width:1048,visible:t,footer:null,onCancel:m},i.a.createElement(E,{reloadData:a,info:c,nextImage:r,prevImage:l,hasNotNext:Math.ceil(o.total/o.pageSize)===o.page&&c.index===o.total%o.pageSize-1,hasNotPrev:1===o.page&&0===c.index}))};t["a"]=S},mCr9:function(e,t,a){"use strict";a.r(t);a("IzEo");var n,r,i,l=a("bx4M"),o=(a("14J3"),a("BMrR")),c=(a("jCWc"),a("kPKH")),m=(a("/zsF"),a("PArb")),s=a("p0pE"),u=a.n(s),d=a("2Taf"),p=a.n(d),g=a("vZ4D"),h=a.n(g),f=a("l4Ni"),_=a.n(f),w=a("ujKo"),E=a.n(w),S=a("MhPg"),x=a.n(S),y=(a("+L6B"),a("2/Rp")),k=(a("y8nQ"),a("Vl3Y")),v=(a("OaEy"),a("2fM7")),b=(a("iQDF"),a("+eQT")),I=a("/MKj"),D=a("q1tI"),z=a.n(D),C=a("wd/R"),M=a.n(C),P=a("wY1l"),q=a.n(P),Y=a("4q7P"),N=a("r0ct"),j=a("es13"),F=(a("5Dmo"),a("3S7+")),B=function(e){var t=e.text,a=e.max;return t.length>a?z.a.createElement(F["a"],{title:t},t.slice(0,a),"..."):t},O=B,H=a("S/iF"),R=a.n(H),A=a("Aeqt"),T=b["a"].RangePicker,K=v["a"].Option,V=function(e){var t=e.form,a=e.onSubmit,n=e.initVals.time_range;return z.a.createElement(k["a"],{className:R.a.timePickerForm,onSubmit:function(e){e.preventDefault(),t.validateFields(function(e,t){e||a(t)})}},z.a.createElement(k["a"].Item,{label:"\u5f55\u5165\u65f6\u95f4"},t.getFieldDecorator("time_range",{rules:[{type:"array"}],initialValue:n})(z.a.createElement(T,{className:R.a.timePicker,showTime:!0,format:"YYYY-MM-DD HH:mm:ss"}))),z.a.createElement(k["a"].Item,{label:"\u5ba1\u6838\u72b6\u6001"},t.getFieldDecorator("manual_check_status",{rules:[{type:"array"}]})(z.a.createElement(v["a"],{mode:"multiple",allowClear:!0},A["b"].map(function(e,t){return z.a.createElement(K,{key:t,value:t},e)})))),z.a.createElement(k["a"].Item,null,z.a.createElement(y["a"],{type:"primary",htmlType:"submit",className:R.a.timePickerFormButton},"\u786e\u5b9a")))},J=k["a"].create({name:"TimeSelectForm"})(V),L=(n=Object(I["c"])(function(e){var t=e.loading,a=e.countDetail;return{data:a,loadingData:t.effects["countDetail/fetch"]}}),n((i=function(e){function t(e){var a;p()(this,t),a=_()(this,E()(t).call(this,e)),a.onChangePage=function(e,t){a.queryData({page:e,pageSize:t,simple:!0})},a.onChangePageSize=function(e,t){a.queryData({page:1,pageSize:t,simple:!0})},a.timeSelectSubmit=function(e){var t={start_time:e.time_range&&2===e.time_range.length?e.time_range[0].format("YYYY-MM-DD HH:mm:ss"):void 0,end_time:e.time_range&&2===e.time_range.length?e.time_range[1].format("YYYY-MM-DD HH:mm:ss"):void 0,manual_check_status:e.manual_check_status?e.manual_check_status:[]},n=a.props.data;a.setState({filters:t},function(){a.queryData({page:1,pageSize:n.pageSize})})},a.reloadData=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=a.state.info.row.id;a.queryData(u()({pageSize:a.props.data.pageSize,page:a.props.data.page,simple:e},a.state.filters)).then(function(){if(a.props.data.items.length<=a.state.info.index)a.setState({showImageModal:!1});else{var e=a.state.info.index,n=a.props.data.items[e];a.setState({info:{index:e,row:n}});var r=a.props.data,i=r.total,l=r.pageSize,o=r.page,c=Math.ceil(i/l)===o&&e===i%l-1;if(t===n.id&&!c)return void a.nextImage();t===n.id&&c&&a.setState({showImageModal:!1}),a.setState({info:{index:e,row:n}})}})},a.showImage=function(e,t){a.setState({showImageModal:!0,info:{index:t,row:e}})},a.nextImage=function(){var e=a.state.info.index,t=a.props.data;t.items.length!==e+1?a.setState({info:{index:e+1,row:t.items[e+1]}}):a.queryData({page:t.page+1,pageSize:t.pageSize}).then(function(){a.setState({info:{index:0,row:t.items[0]}})})},a.prevImage=function(){var e=a.state.info.index,t=a.props.data;0!==e?a.setState({info:{index:e-1,row:t.items[e-1]}}):a.queryData({page:t.page-1,pageSize:t.pageSize}).then(function(){a.setState({info:{index:t.items.length-1,row:t.items[t.items.length-1]}})})};var n=a.props.location.state||{},r=n.start_time,i=n.end_time;return a.state={showImageModal:!1,info:{},filters:{start_time:r,end_time:i,manual_check_status:[]}},a.columns=[{title:"\u7f16\u53f7",dataIndex:"id",width:"4%"},{title:"\u8fdd\u6cd5ID",dataIndex:"src_record_id",width:"13%",render:function(e){return z.a.createElement(O,{text:e,max:20})}},{title:"\u91c7\u96c6\u673a\u5173",render:function(){return z.a.createElement(O,{text:a.props.location.state&&a.props.location.state.name,max:12})},width:"15%"},{title:"\u5f55\u5165\u4eba",dataIndex:"data_entry_person",width:"8%"},{title:"\u5f55\u5165\u65f6\u95f4",dataIndex:"data_entry_time",width:"12%"},{title:"\u8fdd\u6cd5\u4ee3\u7801",dataIndex:"src_illegal_action",width:"%6"},{title:"\u8bc6\u522b\u53f7\u724c\u53f7\u7801",dataIndex:"sdk_car_plate_number",width:"8%"},{title:"\u539f\u59cb\u53f7\u724c\u53f7\u7801",dataIndex:"src_car_plate_number",width:"8%"},{title:"\u8bc6\u522b\u7ed3\u679c",dataIndex:"sdk_reason_code",render:function(e){return A["a"][e-1]},width:"7%"},{title:"\u5ba1\u6838\u7ed3\u679c",dataIndex:"manual_check_status",render:function(e){return A["b"][e]},width:"6%"},{title:"\u64cd\u4f5c",render:function(e,t,n){return z.a.createElement(y["a"],{onClick:function(){return a.showImage(t,n)}},"\u67e5\u770b\u56fe\u7247")},width:"10%"}],a}return x()(t,e),h()(t,[{key:"componentDidMount",value:function(){this.queryData({page:1,pageSize:24})}},{key:"queryData",value:function(e){var t=this.props.location.state||{name:""},a=t.name;return this.props.dispatch({type:"countDetail/fetch",payload:{data:u()({pageSize:e.pageSize,current:(e.page-1)*e.pageSize,name:a,simple:!!e.simple},this.state.filters)}})}},{key:"render",value:function(){var e=this,t=this.state,a=t.showImageModal,n=t.info,r=t.filters,i=this.props,s=i.data,d=i.loadingData,p=i.location.state,g=void 0===p?{}:p,h=g.name;return z.a.createElement(D["Fragment"],null,z.a.createElement(l["a"],{title:"\u901a\u62a5\u7edf\u8ba1",extra:z.a.createElement("span",null,z.a.createElement(N["a"],{url:"/api/get/create/results/info",filter:u()({},r,{name:h})}),z.a.createElement(m["a"],{type:"vertical"}),z.a.createElement(q.a,{to:"/count"},"\u8fd4\u56de"))},z.a.createElement(o["a"],null,z.a.createElement(c["a"],{span:6},z.a.createElement(o["a"],{type:"flex",justify:"space-around"},z.a.createElement(c["a"],null,z.a.createElement(J,{onSubmit:this.timeSelectSubmit,initVals:{time_range:r.start_time&&r.end_time?[M()(r.start_time),M()(r.end_time)]:[]}})))),z.a.createElement(c["a"],{span:18},z.a.createElement(Y["a"],{rowKey:function(e){return e.id},data:s.items,time_total:!1,current:s.page,pageSize:s.pageSize,total:s.total,onShowSizeChange:this.onChangePageSize,onChange:this.onChangePage,loading:d,columns:this.columns})))),z.a.createElement(j["a"],{showImageModal:a,reloadData:this.reloadData,nextImage:this.nextImage,prevImage:this.prevImage,data:s,info:n,onCancel:function(){return e.setState({showImageModal:!1})}}))}}]),t}(D["Component"]),r=i))||r);t["default"]=L},r0ct:function(e,t,a){"use strict";a("+L6B");var n=a("2/Rp"),r=(a("Pwec"),a("CtXQ")),i=a("q1tI"),l=a.n(i),o=function(e){var t=e.url,a=e.filter,i=e.name;return l.a.createElement(n["a"],{target:"_blank",href:"".concat(t,"?").concat(Object.keys(a).map(function(e){return void 0===a[e]?"":Array.isArray(a[e])?"".concat(e,"=[").concat(a[e].join(","),"]"):"".concat(e,"=").concat(a[e])}).filter(function(e){return""!==e}).join("&"))},l.a.createElement(r["a"],{type:"download"}),i||"\u5bfc\u51fa")};t["a"]=o}}]);