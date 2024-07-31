import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import NavBar from "~/components/NavBar";

const CreatePost = () => {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const createPostMutation = api.post.createPost.useMutation();
  const getPresignedUrlMutation = api.s3.getPresignedUrl.useMutation();

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handlePublish = async () => {
    if (!session || !coverImage) {
      console.error("User not authenticated or no image selected");
      return;
    }

    try {
      // Get presigned URL
      const { url } = await getPresignedUrlMutation.mutateAsync({
        filename: coverImage.name,
        filetype: coverImage.type,
      });

      // Upload image to S3
      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": coverImage.type },
        body: coverImage,
      });

      // Continue with post creation
      const response = await createPostMutation.mutateAsync({
        title,
        description,
        body,
        coverImage: url.split("?")[0] || "", // Store the URL without the query string
        createdById: session.user.id,
      });

      console.log("Post created successfully:", response);
      setSuccessMessage("Post created successfully!");
      router.push("/"); // Redirect to the home page
    } catch (error) {
      console.error("Error uploading image or creating post:", error);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="m-12 rounded-lg bg-white p-12 shadow-2xl transition duration-300 hover:bg-slate-50">
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            className="hidden"
            id="cover-image-upload"
          />
          <label
            htmlFor="cover-image-upload"
            className="button-secondary cursor-pointer"
          >
            Add a cover image
          </label>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="New post title here..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-b p-2 text-2xl font-bold focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Add up to 4 tags..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border-b p-2 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Write your post content here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="h-40 w-full rounded-lg border p-2 focus:outline-none"
          />
        </div>
        <div className="flex justify-between">
          <button onClick={handlePublish} className="button-primary">
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
