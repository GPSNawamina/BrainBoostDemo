import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";


export default function CreateBeutyshop() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  console.log(formData);

  const navigate = useNavigate();

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: [downloadURL] }); // Note the array brackets
        });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8081/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        alert("success");
        navigate(``);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
   
    <div className="relative bg-[#d9d9da]">
    <img
      src="https://images.pexels.com/photos/34600/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      alt="Background"
      className="w-full h-[700px] object-cover opacity-90"
    />
        <div className="absolute top-0 w-full px-4 py-6 h-screenbg-gradient-to-r from-[#686868] to-[#d4d5d65b] via-white">
    <div className="absolute inset-0 px-4 flex justify-center items-start pt-16">
    <div className="grid gap-10 max-h-[600px] scrollbar-none overflow-y-auto scrollbar-thin pr-2">
      <div className=" max-w-2xl bg-white/70 w-[500px] backdrop-blur-md p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-serif text-center text-slate-800 mb-6">
          Create New Post
        </h1>
  
        <form onSubmit={handleSubmit} className="space-y-6 ">
          {/* Upload Area */}
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="uploadInput"
              className="w-1/2 h-24 flex items-center justify-center bg-white hover:bg-gray-200 border border-gray-300 rounded-xl cursor-pointer transition"
            >
              <span className="text-lg text-gray-600 font-medium">📷 Upload Photo</span>
              <input
                id="uploadInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
  
            <button
              type="button"
              onClick={handleUpdloadImage}
              disabled={imageUploadProgress}
              className="w-1/2 h-10 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition"
            >
              {imageUploadProgress ? (
                <div className="w-16 h-16 mx-auto">
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}%`}
                  />
                </div>
              ) : (
                "Upload Image"
              )}
            </button>
          </div>
  
          {/* Inputs */}
          <div className="space-y-4 ">
            <input
              type="text"
              placeholder="Title"
              required
              className="w-full h-10 px-4 text-gray-800 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
  
           
          </div>
  
          {/* Image Preview */}
          {formData.image && (
            <div className="mt-4">
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
          )}
  
          {imageUploadError && (
            <p className="text-red-600 text-center">{imageUploadError}</p>
          )}
  
          {/* Content Textarea */}
          <textarea
            placeholder="Write your content here..."
            required
            maxLength={100}
            className="w-full h-24 p-4 text-gray-800 rounded-md bg-white border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
  
          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-40 h-10 bg-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition"
            >
              Post
            </button>
          </div>
  
          {/* Publish Error */}
          {publishError && (
            <p className="text-red-600 text-center bg-red-100 py-2 rounded-lg">
              {publishError}
            </p>
          )}
        </form>
      </div>
      </div>
    </div>
    </div>
  </div>
  
   
  );
}



