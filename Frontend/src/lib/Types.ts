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
