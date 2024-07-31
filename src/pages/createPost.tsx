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

  const router = useRouter();

  const createPostMutation = api.post.createPost.useMutation();
  const getPresignedUrlMutation = api.s3.getPresignedUrl.useMutation();

  const [error, setError] = useState("");

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoverImage(e.target.files?.[0] ?? null);
  };

  const handlePublish = async () => {
    if (!session) {
      console.error("User not authenticated");
      setError("User not authenticated");
      return;
    }
    setError("");

    try {
      let coverImageUrl = "";

      if (coverImage) {
        // Get presigned URL
        const { url } = await getPresignedUrlMutation.mutateAsync({
          filename: coverImage.name,
          filetype: coverImage.type,
        });

        try {
          // Upload image to S3
          await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": coverImage.type },
            body: coverImage,
          });

          // Store the URL without the query string
          coverImageUrl = url.split("?")[0] ?? "";
        } catch (error) {
          console.error("Error setting cover image:", error);
          setError("Error uploading cover image.");
        }
      }

      // Continue with post creation
      const response = await createPostMutation.mutateAsync({
        title,
        description,
        body,
        coverImage: coverImageUrl, // Store the URL without the query string
        createdById: session.user.id,
      });

      console.log("Post created successfully:", response);
      try {
        router.push("/"); // Redirect to the home page
      } catch (error) {
        setError("Error redirect to the home page");
        console.error("Error Error redirect to the home page:", error);
      }
    } catch (error) {
      setError("Error creating post.");
      console.error("Error uploading image or creating post:", error);
    }
  };

  return (
    <div>
      <NavBar />
      {error && <p style={{ color: "red" }}>{error}</p>}
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
