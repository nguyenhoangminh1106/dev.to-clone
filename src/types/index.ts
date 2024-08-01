export type PostType = {
  id: number;
  title: string;
  description: string;
  body: string;
  coverImage: string | null;
  createdBy: {
    id: string;
    name: string | null;
    profileImage: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
};
