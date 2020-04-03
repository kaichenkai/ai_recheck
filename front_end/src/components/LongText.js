import { Tooltip } from "antd";

const LongText = ({text, max}) => text.length > max ? <Tooltip title={text}>{text.slice(0, max)}...</Tooltip> : text

export default LongText