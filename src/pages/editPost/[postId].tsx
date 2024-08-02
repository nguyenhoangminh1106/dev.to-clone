import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Header from "~/components/Header";
import NavBar from "~/components/NavBar";
import Image from "next/image";
import BackButton from "~/components/BackButton";
import type { ParsedUrlQuery } from "querystring";
import Footer from "~/components/Footer";

const EditPost = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { postId } = router.query as ParsedUrlQuery & { postId: number };
  const [editError, setEditError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [oldCoverImage, setOldCoverImage] = useState("");
  const [tempCoverImageUrl, setTempCoverImageUrl] = useState<string | null>(
    null,
  );

  const updatePostMutation = api.post.updatePost.useMutation();
  const getPresignedUrlMutation = api.s3.getPresignedUrl.useMutation();

  // Parse postId from query
  const numericPostId = typeof postId === "string" ? parseInt(postId, 10) : NaN;

  // Fetch post data using useQuery, only if numericPostId is valid
  const { data, error } = api.post.getPostById.useQuery(
    { postId: numericPostId },
    { enabled: !isNaN(numericPostId) },
  );

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
      setBody(data.body);
      const oldCoverImage = data.coverImage;

      if (oldCoverImage) {
        setOldCoverImage(oldCoverImage);
        setTempCoverImageUrl(oldCoverImage);
      }
    } else if (error) {
      console.error("Error fetching post:", error);
      setEditError(`Error fetching post.`);
    }
  }, [data, error]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0] ?? null;
    setCoverImage(image);
    if (image) {
      setTempCoverImageUrl(URL.createObjectURL(image));
    } else {
      setTempCoverImageUrl(null);
    }
  };

  const handleUpdate = async () => {
    if (!session) {
      console.error("User not authenticated");
      setEditError(`User not authenticated`);
      return;
    }
    setEditError("Loading image...");
    let coverImageUrl = oldCoverImage;

    if (coverImage) {
      try {
        // Get presigned URL for new image
        const { url } = await getPresignedUrlMutation.mutateAsync({
          filename: coverImage.name,
          filefolder: "coverImage",
          filetype: coverImage.type,
        });

        // Upload new image to S3
        await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": coverImage.type },
          body: coverImage,
        });

        // Store the URL without the query string
        coverImageUrl = url.split("?")[0] ?? "";
      } catch (error) {
        console.error("Error handling cover image:", error);
        setEditError(`Error handling cover image.`);
      }
    }

    try {
      setEditError("Updating post...");
      // Continue with post creation
      const response = await updatePostMutation.mutateAsync({
        postId: numericPostId,
        title,
        description,
        body,
        coverImage: coverImageUrl, // Store the URL without the query string
      });

      console.log("Post updated successfully:", response);
      await router.push("/"); // Redirect to the home page
    } catch (error) {
      setEditError(`Error creating post.`);
      console.error("Error creating post:", error);
    }
  };

  return (
    <div>
      <Header />
      <NavBar />
      <BackButton />
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
            Change cover image
          </label>

          {tempCoverImageUrl && (
            <Image
              src={tempCoverImageUrl}
              alt="New cover"
              width={500}
              height={300}
              className="mx-auto my-6 rounded-lg object-cover"
            />
          )}
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-b p-2 text-2xl font-bold focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Post description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border-b p-2 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Post content"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="h-40 w-full rounded-lg border p-2 focus:outline-none"
          />
        </div>
        <div className="flex">
          <button onClick={handleUpdate} className="button-primary">
            Update Post
          </button>

          <span>
            {editError && <p style={{ color: "red" }}>{editError}</p>}
          </span>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditPost;
