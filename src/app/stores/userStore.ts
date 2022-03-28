import { makeAutoObservable } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { LoginCredentials } from "../models/loginCredentials";
import { RegistrationFormValues } from "../models/registrationFormValues";
import { User } from "../models/user";
import { store } from "./store";

export default class UserStore {
  user: User | undefined = undefined;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return this.user ? true : false;
  }

  login = async (credentials: LoginCredentials) => {
    this.setLoading(true);
    try {
      const user = await agent.Account.login(credentials);
      store.commonStore.setToken(user.token);
      this.setUser(user);
      history.push("/activities");
      this.setLoading(false);
    } catch (error) {
      this.setLoading(false);
      throw error;
    }
  };

  register = async (values: RegistrationFormValues) => {
    this.setLoading(true);
    try {
      const user = await agent.Account.register(values);
      store.commonStore.setToken(user.token);
      this.setUser(user);
      history.push("/activities");
      this.setLoading(false);
    } catch (error) {
      this.setLoading(false);
      throw error;
    }
  };

  logout = async () => {
    store.commonStore.setToken(null);
    window.localStorage.removeItem("jwt");
    this.setUser(undefined);
    history.push("/");
  };

  setLoading = (value: boolean) => {
    this.loading = value;
  };

  getUser = async () => {
    try {
      const user = await agent.Account.getCurrentUser();
      this.setUser(user);
    } catch (e) {
      console.log(e);
    }
  };

  setImage = (image: string) => {
    if (this.user) this.user.image = image;
  };

  private setUser = (user: User | undefined) => {
    this.user = user;
  };
}
