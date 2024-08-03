import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Image from "next/image";

const Settings = () => {
  const { data: session } = useSession();
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageName, setProfileImageName] = useState("No file chosen");

  const { data: user, refetch } = api.user.getUserById.useQuery({
    userId: session?.user.id ?? "",
  });

  const [status, setStatus] = useState("");

  const updateUserMutation = api.user.updateUser.useMutation();
  const getPresignedUrlMutation = api.s3.getPresignedUrl.useMutation();

  const defaultProfileImage =
    "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/profileImage/6yvpkj.jpg";

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setProfileImage(file);
      setProfileImageName(file.name);
    }
  };

  const handleUpdateProfile = async () => {
    let profileImageUrl = user?.image;
    if (profileImage) {
      setStatus("Loading Image");
      const { url } = await getPresignedUrlMutation.mutateAsync({
        filename: profileImage.name,
        filefolder: "profileImage",
        filetype: profileImage.type,
      });

      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": profileImage.type },
        body: profileImage,
      });

      profileImageUrl = url.split("?")[0];
    }

    setStatus("Updating Profile");

    await updateUserMutation.mutateAsync({
      userId: session?.user.id ?? "",
      bio: bio ?? user?.bio ?? "",
      image: profileImageUrl ?? defaultProfileImage,
    });

    try {
      await refetch();
    } catch (error) {
      console.log("Refetch unsuccessfully: ", error);
    }
    setStatus("Updating Successfully");
  };

  return (
    <div className="flex flex-col justify-center space-y-5">
      <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold">User</h1>
        <div className="mb-6">
          <div className="mb-4">
            <label className="mb-2 block font-semibold text-gray-700">
              Name
            </label>
            <input
              type="text"
              className="w-full rounded border px-3 py-2"
              value={user?.name ?? ""}
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block font-bold text-gray-700">Email</label>
            <input
              type="text"
              className="w-full rounded border px-3 py-2"
              value={user?.email ?? ""}
              disabled
            />
          </div>
          <label className="mb-2 block font-semibold text-gray-700">
            Profile Image
          </label>
          <div className="mb-4 flex items-center">
            <Image
              src={user?.image ?? defaultProfileImage}
              alt="Profile"
              width={50}
              height={50}
              className="h-10 w-10 rounded-full"
            />
            <div className="ml-4">
              <input
                type="file"
                onChange={handleProfileImageChange}
                className="hidden"
                id="profile-image-upload"
              />
              <label
                htmlFor="profile-image-upload"
                className="button-secondary cursor-pointer"
              >
                Choose File
              </label>
              <span className="ml-4 text-gray-600">{profileImageName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold">Basic</h1>
        <div className="mb-6">
          <div className="mb-4">
            <label className="mb-2 block font-semibold text-gray-700">
              Website
            </label>
            <input
              type="text"
              className="w-full rounded border px-3 py-2"
              value="www.example.com"
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block font-bold text-gray-700">
              Location
            </label>
            <input
              type="text"
              className="w-full rounded border px-3 py-2"
              value="Australia"
              disabled
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Bio</h2>
          <textarea
            className="w-full rounded border px-3 py-2"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Enter your bio"
          />
        </div>
      </div>
      <div className="flex w-full items-center space-x-2 pb-5">
        <button onClick={handleUpdateProfile} className="button-primary">
          Save Changes
        </button>
        <span>{status && <p style={{ color: "red" }}>{status}</p>}</span>
      </div>
    </div>
  );
};

export default Settings;
