import { Modal } from "antd";

import ImageBrowser from "./imageBrowser";

const ImageBrowserModal = ({showImageModal, reloadData, nextImage, prevImage, data, info, onCancel}) => (
  <Modal
    title="查看详情"
    width={800 + 200 + 48}
    visible={showImageModal}
    footer={null}
    onCancel={onCancel}
  >
    <ImageBrowser
      reloadData={reloadData}
      info={info}
      nextImage={nextImage}
      prevImage={prevImage}
      hasNotNext={Math.ceil(data.total / data.pageSize) === data.page && info.index === data.total % data.pageSize - 1}
      hasNotPrev={data.page === 1 && info.index === 0}
    />
  </Modal>
)

export default ImageBrowserModal;