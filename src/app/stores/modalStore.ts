import { makeAutoObservable } from "mobx";

interface Modal {
  open: boolean;
  body: JSX.Element | null;
  headerText?: string;
}

class ModalStore {
  modal: Modal = {
    open: false,
    body: null,
    headerText: undefined,
  };

  constructor() {
    makeAutoObservable(this);
  }

  openModal = (body: JSX.Element, headerText?: string) => {
    this.modal.open = true;
    this.modal.headerText = headerText ?? "";
    this.modal.body = body;
  };

  closeModal = () => {
    this.modal.open = false;
    this.modal.headerText = "";
    this.modal.body = null;
  };
}

export default ModalStore;
