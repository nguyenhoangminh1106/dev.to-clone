// UserProfile.tsx
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";
import type { ParsedUrlQuery } from "querystring";
import NavBar from "~/components/NavBar";
import PostList from "~/components/PostList";
import BackButton from "~/components/BackButton";
import Footer from "~/components/Footer";

const UserProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { userId } = router.query as ParsedUrlQuery & { userId: string };
  const [editing, setEditing] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
  const [newProfilePictureName, setNewProfilePictureName] =
    useState("No file chosen");

  const updateUserMutation = api.user.updateUser.useMutation();
  const getPresignedUrlMutation = api.s3.getPresignedUrl.useMutation();

  const defaultProfileImage =
    "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/profileImage/6yvpkj.jpg";

  // Fetch user profile data
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = api.user.getUserById.useQuery({ userId });

  // Handle profile picture change
  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewProfilePictureName("Loading...");
    const image = e.target.files?.[0] ?? null;
    setNewProfilePicture(image);

    if (image) {
      setNewProfilePictureName(image.name);
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    setNewProfilePictureName("Loading...");

    if (!session) return;

    // Handle new profile picture upload
    let profilePictureUrl = user?.image;
    if (newProfilePicture) {
      // Get presigned URL and upload
      const { url } = await getPresignedUrlMutation.mutateAsync({
        filename: newProfilePicture.name,
        filefolder: "profileImage",
        filetype: newProfilePicture.type,
      });

      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": newProfilePicture.type },
        body: newProfilePicture,
      });

      profilePictureUrl = url.split("?")[0];
    }

    // Update user profile
    await updateUserMutation.mutateAsync({
      userId,
      bio: newBio ?? user?.bio ?? "",
      image: profilePictureUrl ?? defaultProfileImage,
    });

    try {
      refetch();
    } catch (error) {
      console.log("Refetch unsuccessfully: ", error);
    }
    setNewProfilePictureName("");
    setEditing(false);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading profile.</p>;

  return (
    <div>
      <NavBar />
      <BackButton />
      <div className="mt-12 flex flex-col items-center space-y-4 bg-gray-50 p-4">
        <div className="relative h-48 w-full bg-gray-800">
          <div className="absolute left-1/2 mt-6 -translate-x-1/2 -translate-y-2/3 transform">
            <Image
              src={user?.image ?? defaultProfileImage}
              alt="Profile Picture"
              width={500}
              height={500}
              className="h-44 w-44 rounded-full border-2 border-white shadow-lg"
            />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p className="text-gray-500">{user?.bio ?? "404 bio not found"}</p>
        </div>

        {session?.user?.id === user?.id && (
          <button
            onClick={() => setEditing(!editing)}
            className="button-primary"
          >
            Edit Profile
          </button>
        )}

        <div
          className={`w-full max-w-xl space-y-4 overflow-hidden transition-all duration-1000 ease-in-out ${
            editing ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <textarea
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            placeholder="Update your bio..."
            className="w-full rounded-md border border-gray-300 p-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="block hidden w-full"
            id="profile-image-upload"
          />
          <div>
            <label
              htmlFor="profile-image-upload"
              className="button-secondary cursor-pointer"
            >
              Add a cover image
            </label>
            {newProfilePictureName}
          </div>
          <button
            onClick={handleUpdateProfile}
            className="button-primary w-full"
          >
            Save Changes
          </button>
        </div>

        <PostList posts={user?.posts ?? []} refetch={refetch} />
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;
