import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import NavBar from "~/components/NavBar";
import Image from "next/image";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import "react-markdown-editor-lite/lib/index.css";

const mdParser = new MarkdownIt();

const CreatePost = () => {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [tempCoverImageUrl, setTempCoverImageUrl] = useState<string | null>(
    null,
  );
  const [error, setError] = useState("");
  const router = useRouter();

  const createPostMutation = api.post.createPost.useMutation();
  const getPresignedUrlMutation = api.s3.getPresignedUrl.useMutation();

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0] ?? null;
    setCoverImage(image);
    if (image) {
      setTempCoverImageUrl(URL.createObjectURL(image));
    } else {
      setTempCoverImageUrl(null);
    }
  };

  const handleEditorChange = ({ text }: { text: string }) => {
    setBody(text);
  };

  const handlePublish = async () => {
    if (!session) {
      console.error("User not authenticated");
      setError("User not authenticated");
      return;
    }

    setError("");
    let coverImageUrl = "";

    if (coverImage) {
      setError("Loading image...");
      // Get presigned URL
      const { url } = await getPresignedUrlMutation.mutateAsync({
        filename: coverImage.name,
        filefolder: "coverImage",
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

    try {
      setError("Uploading post...");
      // Continue with post creation
      const response = await createPostMutation.mutateAsync({
        title,
        description,
        body,
        coverImage: coverImageUrl, // Store the URL without the query string
        createdById: session.user.id,
      });

      console.log("Post created successfully:", response);
      await router.push("/"); // Redirect to the home page
    } catch (error) {
      setError("Error creating post.");
      console.error("Error creating post:", error);
    }
  };

  return (
    <div>
      <NavBar />

      <div className="mx-1 flex lg:ml-32 lg:mr-24">
        <div className="my-12 w-full bg-white p-8 shadow-2xl transition duration-300 hover:bg-slate-50 sm:w-8/12">
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
              placeholder="New post title here..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-b p-2 text-2xl font-bold focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Write your post description here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-b p-2 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <MdEditor
              placeholder="Post content"
              value={body}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
              className="h-80 w-full rounded-lg border p-2 focus:outline-none"
            />
          </div>
          <div className="flex items-center">
            <button onClick={handlePublish} className="button-primary">
              Publish
            </button>
            <button className="button-secondary">Save draft</button>
            <span>{error && <p style={{ color: "red" }}>{error}</p>}</span>
          </div>
        </div>
        <div className="hidden w-4/12 px-1 py-36 sm:block">
          <div className="rounded-lg p-6">
            <h2 className="mb-4 text-lg font-bold">
              Writing a Great Post Title
            </h2>
            <ul className="list-inside list-disc text-gray-500">
              <li>
                Think of your post title as a super short (but compelling!)
                description — like an overview of the actual post in one short
                sentence.
              </li>
              <li>
                Use keywords where appropriate to help ensure people can find
                your post by search.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
