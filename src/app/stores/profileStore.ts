import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Pagination, PagingParams } from "../models/pagination";
import { Photo, Profile, UserActivity } from "../models/profile";
import { store } from "./store";

export default class ProfileStore {
  profile: Profile | null = null;
  loadingProfile = false;
  uploading = false;
  loading = false;
  loadingFollow = false;
  loadingFollowings = false;
  followings: Profile[] = [];
  activeTab = 0;
  userActivities: UserActivity[] = [];
  loadingActivities = false;
  userActivitiesPagination: Pagination | null = null;
  userActivitiesPagingParams = new PagingParams(1, 12);

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.activeTab,
      (activeTab) => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? "followers" : "following";
          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
      }
    );
  }

  setActiveTab = (activeTab: any) => {
    this.activeTab = activeTab;
  };

  get isCurrentUser() {
    if (store.userStore.user && this.profile) {
      return store.userStore.user.userName === this.profile.userName;
    }
    return false;
  }

  loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.details(username);
      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => (this.loadingProfile = false));
    }
  };

  uploadPhoto = async (file: Blob) => {
    this.uploading = true;
    try {
      const response = await agent.Profiles.uploadPhoto(file);
      const photo = response.data;
      runInAction(() => {
        if (this.profile) {
          this.profile.photos?.push(photo);
          if (photo.isMain && store.userStore.user) {
            store.userStore.setImage(photo.url);
            this.profile.image = photo.url;
          }
        }
        this.uploading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => (this.uploading = false));
    }
  };

  setMainPhoto = async (photo: Photo) => {
    this.loading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      store.userStore.setImage(photo.url);
      runInAction(() => {
        if (this.profile && this.profile.photos) {
          this.profile.photos.find((p) => p.isMain)!.isMain = false;
          this.profile.photos.find((p) => p.id === photo.id)!.isMain = true;
          this.profile.image = photo.url;
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => (this.loading = false));
      console.log(error);
    }
  };

  deletePhoto = async (photo: Photo) => {
    this.loading = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos = this.profile.photos?.filter((p) => p.id !== photo.id);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => (this.loading = false));
      console.log(error);
    }
  };

  updateProfile = async (profile: Partial<Profile>) => {
    this.loading = true;
    try {
      await agent.Profiles.updateProfile(profile);
      runInAction(() => {
        if (profile.displayName && profile.displayName !== store.userStore.user?.displayName) {
          store.userStore.setDisplayName(profile.displayName);
        }
        this.profile = { ...this.profile, ...(profile as Profile) };
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => (this.loading = false));
    }
  };

  updateFollowing = async (userName: string, following: boolean) => {
    this.loadingFollow = true;
    try {
      await agent.Profiles.updateFollowing(userName);
      store.activityStore.updateAttendeeFollowing(userName);

      runInAction(() => {
        if (
          this.profile &&
          this.profile.userName !== store.userStore.user?.userName &&
          this.profile.userName === userName
        ) {
          following ? this.profile.followersCount++ : this.profile.followersCount--;
          this.profile.following = !this.profile.following;
        }

        if (this.profile && this.profile.userName === store.userStore.user?.userName) {
          following ? this.profile.followersCount++ : this.profile.followersCount--;
        }

        this.followings.forEach((profile) => {
          if (profile.userName === userName) {
            profile.following ? profile.followersCount-- : profile.followersCount++;
            profile.following = !profile.following;
          }
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loadingFollow = false;
      });
    }
  };

  loadFollowings = async (predicate: string) => {
    this.loadingFollowings = true;
    try {
      const followings = await agent.Profiles.listFollowings(this.profile?.userName!, predicate);
      runInAction(() => {
        this.followings = followings;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loadingFollowings = false;
      });
    }
  };

  getAxiosParams(predicate: string) {
    const params = new URLSearchParams();
    params.append("pageNumber", this.userActivitiesPagingParams.pageNumber.toString());
    params.append("pageSize", this.userActivitiesPagingParams.pageSize.toString());
    params.append("predicate", predicate);
    return params;
  }

  setPagingParams = (pagingParams: PagingParams) => {
    this.userActivitiesPagingParams = pagingParams;
  };

  loadUserActivities = async (username: string, predicate?: string) => {
    this.loadingActivities = true;
    try {
      const params = this.getAxiosParams(predicate!);
      const result = await agent.Profiles.listActivities(username, params);

      runInAction(() => {
        this.userActivities = result.data;
        this.userActivitiesPagination = result.pagination;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loadingActivities = false;
      });
    }
  };
}
