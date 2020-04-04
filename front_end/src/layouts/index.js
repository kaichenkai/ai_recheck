import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import withRouter from 'umi/withRouter';
import { SwitchTransition, CSSTransition } from "react-transition-group";

const BasicLayout = ({ location, children }) => {
  return (
    <ConfigProvider locale={zh_CN}>
      <SwitchTransition>
        <CSSTransition key={location.pathname} classNames="fade" timeout={150}>
          { children }
        </CSSTransition>
      </SwitchTransition>
    </ConfigProvider>
  )
}

export default withRouter(BasicLayout)

