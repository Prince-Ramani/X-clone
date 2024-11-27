import toast from "react-hot-toast";
export const createPostMutationFn = async (formData: FormData) => {
  const res = await fetch("/api/post/createpost", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if ("error" in data) toast.error(data.error);

  return data;
};
