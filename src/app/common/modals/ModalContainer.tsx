import { observer } from "mobx-react-lite";
import React from "react";
import { Header, Modal, ModalDimmerProps, SemanticShorthandItem } from "semantic-ui-react";
import { useStore } from "../../stores/store";

interface Props {
  size?: "mini" | "tiny" | "small" | "large" | "fullscreen";
  dimmer?: SemanticShorthandItem<ModalDimmerProps>;
}

const ModalContainer = ({ size, dimmer }: Props) => {
  const { modalStore } = useStore();
  const { closeModal, modal } = modalStore;

  const container = (
    <Modal dimmer={dimmer} size={size} closeIcon open={modal.open} onClose={() => closeModal()}>
      <Header content={modal.headerText ?? ""} />
      <Modal.Content>{modal.body}</Modal.Content>
    </Modal>
  );
  return container;
};

export default observer(ModalContainer);
