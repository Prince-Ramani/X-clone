import TextareaAutosize from "react-textarea-autosize";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";

import { Camera, X } from "lucide-react";
import { useAuthUser } from "@/context/userContext";

import { useEditProfileContext } from "@/context/EditProfileContext";
import CustomTooltip from "@/customComponents/ToolTip";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const EditProfileDialog = () => {
  const { isEditProfileDialogOpen, setIsEditProfileDialog } =
    useEditProfileContext();
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [file, setFile] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePreview2, setImagePreview2] = useState<string | null>(null);

  const [info, setInfo] = useState({
    username: authUser?.username,
    bio: authUser?.bio,
    password: "",
    newpass: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileExists = e.target.files?.[0];
    if (fileExists) {
      setFile(fileExists);
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(fileExists);
    }
  };
  const handleFileChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileExists = e.target.files?.[0];
    if (fileExists) {
      setFile2(fileExists);
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview2(reader.result as string);
      };
      reader.readAsDataURL(fileExists);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: any) => {
      const res = await fetch("/api/updateprofile", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if ("error" in data) toast.error(data.error);
      return data;
    },
    onSuccess: async (data) => {
      if ("error" in data) return;
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({
        queryKey: [authUser?.username, "Profile"],
      });
      queryClient.invalidateQueries({
        queryKey: [authUser?.username, "Posts"],
      });
      queryClient.invalidateQueries({
        queryKey: [authUser?.username, "Media"],
      });
      setIsEditProfileDialog(false);
      toast.success(data.message);
    },
  });

  const handleSubmit = () => {
    if (!info.username) return toast.error("Username required!");
    if (!info.password) return toast.error("Password required!");
    if (info.newpass && info.newpass.length < 6)
      toast.error("New password lenght must be greter than 6 characters!");
    const formData = new FormData();
    if (info.newpass) formData.append("newpass", info.newpass);
    if (info.bio) formData.append("bio", info.bio);
    if (info.username !== authUser?.username && info.username)
      formData.append("username", info.username);
    formData.append("password", info.password);
    if (file) formData.append("banner", file);
    if (file2) formData.append("profilePic", file2);
    mutate(formData);
  };

  return (
    <Dialog
      open={isEditProfileDialogOpen}
      onOpenChange={setIsEditProfileDialog}
    >
      <DialogContent className="fixed inset-0 flex items-center pt-9 p-2 sm:pt-9 z-50 flex-col bg-blue-200/20 bg-opacity-50 ">
        <DialogTitle />
        <div className="bg-black  rounded-2xl max-w-xl w-full">
          <div className="flex  items-center gap-4 p-3 pb-2 ">
            <CustomTooltip title="Close">
              <button
                className={`  text-white  p-2 rounded-full ${
                  isPending ? "" : "hover:bg-gray-800/50"
                }   `}
                onClick={() => setIsEditProfileDialog(false)}
                disabled={isPending}
              >
                <X />
              </button>
            </CustomTooltip>
            <div className="font-bold text-lg">Edit profile</div>
            <div className="ml-auto">
              <button
                className={`bg-white font-semibold rounded-full p-1 px-4 hover:opacity-95 text-black ${
                  isPending ? "opacity-70" : ""
                }`}
                onClick={() => handleSubmit()}
              >
                Save
              </button>
            </div>
          </div>

          <DialogDescription>
            <div className="  w-full overflow-y-auto h-[500px] no-scrollbar  flex flex-col p-0.5 ">
              <div className=" relative flex justify-center items-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    className="w-full h-fit max-h-52  object-fill  opacity-70"
                  />
                ) : (
                  <img
                    src={authUser?.banner}
                    className="w-full h-fit max-h-52 object-fill   opacity-70"
                  />
                )}

                <input
                  type="file"
                  className="hidden"
                  id="fileInput"
                  onChange={handleFileChange}
                />

                <div className="absolute flex gap-2  opacity-100 cursor-pointer ">
                  <label htmlFor="fileInput">
                    <div className=" rounded-full  bg-black/30 hover:bg-white/10 transition-colors">
                      <Camera className="cursor-pointer p-3 size-12 opacity-70 hover:opacity-100" />
                    </div>
                  </label>
                  {imagePreview ? (
                    <div className=" rounded-full  bg-black/30 hover:bg-white/10 transition-colors">
                      <X
                        className="cursor-pointer p-3 size-12 opacity-70 hover:opacity-100"
                        onClick={() => setImagePreview(null)}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="p-2 relative bottom-16">
                <input
                  type="file"
                  className="hidden"
                  id="fileInput2"
                  onChange={handleFileChange2}
                />
                <div className="p-1 ml-2 relative flex items-center justify-center rounded-full bg-black h-fit w-fit ">
                  {" "}
                  {imagePreview2 ? (
                    <img
                      src={imagePreview2}
                      className="size-28 rounded-full object-cover select-none opacity-70"
                    />
                  ) : (
                    <img
                      src={authUser?.profilePic}
                      className="size-28 rounded-full object-cover select-none opacity-70"
                    />
                  )}
                  <div className="absolute">
                    <label htmlFor="fileInput2">
                      <div className="  rounded-full  bg-black/30 hover:bg-white/10 transition-colors">
                        <Camera className="cursor-pointer p-3 size-12 opacity-70 hover:opacity-100" />
                      </div>
                    </label>
                  </div>
                </div>
                <div className="p-2 flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <div>Username</div>
                    <Input
                      placeholder="Username"
                      className="h-14"
                      max={12}
                      value={info.username}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setInfo({ ...info, username: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>Bio</div>
                    <Input
                      placeholder="Bio"
                      className="h-14"
                      max={160}
                      value={info.bio}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setInfo({ ...info, bio: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>Location</div>
                    <Input placeholder="Location" className="h-14" max={30} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>Password*</div>
                    <TextareaAutosize
                      placeholder="Password"
                      type="password"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      value={info.password}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setInfo({ ...info, password: e.target.value })
                      }
                      minRows={3}
                      maxRows={7}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>(New password)</div>
                    <Input
                      placeholder="Password"
                      type="password"
                      className="h-14"
                      max={12}
                      value={info.newpass}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setInfo({ ...info, newpass: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
