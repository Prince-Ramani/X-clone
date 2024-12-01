import { UploadedByType } from "@/Mycomponents/Home/ForYou";

export interface CommentType {
  commenter: Commenter;
  createdAt: string;
  updatedAt?: string;
  likes: any[];
  _id: string;
  text: string;
}

export interface Commenter {
  banner: string;
  bio: string | undefined;
  createdAt: string;
  updatedAt: string;
  email: string;
  followers: any[];
  following: any[];
  links: any[];
  profilePic: string;
  username: string;
  _id: string;
}

export interface NotificationsType {
  _id: string;
  createdAt: string;
  updated: string;
  from: UploadedByType;
  to: string;
  read: boolean;
  postId?: {
    postContent: string;
    _id: string;
  };
  topic: "like" | "follow";
}
