import { User } from "./user";

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}

export interface Profile {
  userName?: string;
  displayName?: string;
  image?: string;
  bio?: string;
  photos?: Photo[];
  following: boolean;
  followersCount: number;
  followingCount: number;
}

export class Profile implements Profile {
  constructor(user: User) {
    this.userName = user.userName;
    this.displayName = user.displayName;
    this.bio = "";
    this.image = user.image;
  }
}
