import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { Activity, ActivityFormValues } from "../models/activity";
import { LoginCredentials } from "../models/loginCredentials";
import { Photo, Profile } from "../models/profile";
import { RegistrationFormValues } from "../models/registrationFormValues";
import { User } from "../models/user";
import { store } from "../stores/store";
import sharp from "sharp";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.defaults.baseURL = "https://localhost:5001/api";
axios.interceptors.response.use(
  async (response) => {
    await sleep(1000);
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response!;
    switch (status) {
      case 400:
        if (typeof data === "string") {
          toast.error(data);
        }
        if (config.method === "get" && data.errors.hasOwnProperty("id")) {
          history.push("/not-found");
        }
        if (data.errors) {
          const modalStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
          }
          throw modalStateErrors.flat();
        }
        break;
      case 401:
        toast.error("unauthorised");
        break;
      case 404:
        history.push("/not-found");
        break;
      case 500:
        store.commonStore.setServerError(data);
        history.push("/server-error");
        break;
    }
    return Promise.reject(error);
  }
);
axios.interceptors.request.use(function (config) {
  const token = window.localStorage.getItem("jwt");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
  list: () => requests.get<Activity[]>("/activities"),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: ActivityFormValues) => requests.post<void>("/activities", activity),
  update: (activity: ActivityFormValues) =>
    requests.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del<void>(`/activities/${id}`),
  attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
};

const Account = {
  getCurrentUser: () => requests.get<User>("/account"),
  login: (credentials: LoginCredentials) => requests.post<User>("/account/login", credentials),
  register: (values: RegistrationFormValues) => requests.post<User>("/account/register", values),
};

const Profiles = {
  details: (userName: string) => requests.get<Profile>(`/profiles/${userName}`),
  uploadPhoto: async (file: Blob) => {
    let resizedFile = await sharp({}).resize(100, 100);
    let formData = new FormData();
    formData.append("File", file);
    return axios.post<Photo>("photos", formData, {
      headers: { "Content-type": "multipart/form-data" },
    });
  },
  setMainPhoto: (id: string) => requests.post<void>(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => requests.del<void>(`/photos/${id}`),
  updateFollowing: (userName: string) => requests.post<void>(`/follow/${userName}`, {}),
  listFollowings: (userName: string, predicate: string) =>
    requests.get<Profile[]>(`/follow/${userName}?predicate=${predicate}`),
};

const agent = {
  Activities,
  Account,
  Profiles,
};

export default agent;
