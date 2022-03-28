import { makeAutoObservable } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
  error: ServerError | null = null;
  token: string | null = window.localStorage.getItem("jwt");
  appLoaded: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setServerError = (error: ServerError) => {
    this.error = error;
  };

  setToken = (token: string | null) => {
    try {
      if (token) window.localStorage.setItem("jwt", token);
      this.token = token;
    } catch (e) {
      console.log(e);
    }
  };

  setAppLoaded = (value: boolean) => {
    this.appLoaded = value;
  };
}
