import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";
import type { ParsedUrlQuery } from "querystring";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import "react-markdown-editor-lite/lib/index.css";
import { TagsInput } from "react-tag-input-component";

const mdParser = new MarkdownIt();

/**
 * PAGE TO EDIT A POST
 * @returns
 */
const EditPost = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { postId } = router.query as ParsedUrlQuery & { postId: number };
  const [editError, setEditError] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState(["tags"]);
  const [body, setBody] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [oldCoverImage, setOldCoverImage] = useState("");
  const [tempCoverImageUrl, setTempCoverImageUrl] = useState<string | null>(
    null,
  );

  const updatePostMutation = api.post.updatePost.useMutation();

  // Link to image in S3 bucket
  const getPresignedUrlMutation = api.s3.getPresignedUrl.useMutation();

  // Parse postId from query
  const numericPostId = typeof postId === "string" ? parseInt(postId, 10) : NaN;

  // Fetch post data using useQuery, only if numericPostId is valid
  const { data, error } = api.post.getPostById.useQuery(
    { postId: numericPostId },
    { enabled: !isNaN(numericPostId) },
  );

  const handleEditorChange = ({ text }: { text: string }) => {
    setBody(text);
  };

  // Update the data
  useEffect(() => {
    if (data) {
      const tagList = data.description
        .trim() // Remove any leading or trailing whitespace
        .split(" ") // Split the string by spaces
        .filter((tag) => tag) // Remove any empty strings
        .map((tag) => tag.slice(1));
      setTitle(data.title);
      setTags(tagList);
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
      const description =
        tags.map((tag) => `#${tag.toLowerCase()}`).join(" ") + " ";
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
    <div className="mx-1 flex lg:ml-32 lg:mr-24">
      {/* Update form */}
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
          {/* <textarea
            placeholder="Post description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border-b p-2 focus:outline-none"
          /> */}
          <TagsInput
            value={tags}
            onChange={setTags}
            name="tags"
            placeHolder="Add up to 4 tags..."
            separators={
              tags.length <= 4 ? ["Enter", " "] : ["~Only up to 4 tags~ Sorry!"]
            }
          />
        </div>
        <div className="mb-4">
          {/* Allow user to use Markdown to decorate their post */}
          <MdEditor
            placeholder="Post content"
            value={body}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
            className="h-40 min-h-screen w-full rounded-lg border p-2 focus:outline-none"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handleUpdate} className="button-primary">
            Update Post
          </button>

          <span>
            {editError && <p style={{ color: "red" }}>{editError}</p>}
          </span>
        </div>
      </div>

      {/* Right side area of the page */}
      <div className="hidden w-4/12 px-1 py-36 sm:block">
        <div className="rounded-lg p-6">
          <h2 className="mb-4 text-lg font-bold">Writing a Great Post Title</h2>
          <ul className="list-inside list-disc text-gray-500">
            <li>
              Think of your post title as a super short (but compelling!)
              description — like an overview of the actual post in one short
              sentence.
            </li>
            <li>
              Use keywords where appropriate to help ensure people can find your
              post by search.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
