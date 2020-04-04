import { Button, Icon } from "antd";


// 导出功能
const Download = ({ url, filter, name }) => {
  return (
    <Button target="_blank" href={
      `${url}?${
        Object.keys(filter).map(k => {
          if(filter[k] === undefined){
            return ""
          }
          if (Array.isArray(filter[k])) {
            return `${k}=[${filter[k].join(",")}]`
          } else {
            return `${k}=${filter[k]}`
          }
        }).filter(e=>e!=="").join("&")
      }`
    }><Icon type="download" />{name ? name : "导出"}</Button>
  )
}

export default Download;
