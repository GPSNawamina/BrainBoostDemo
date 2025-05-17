import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";


export default function Post() {
  const { currentUser } = useSelector((state) => state.user);
  const [workouts, setWorkouts] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [notification, setNotification] = useState(null);
  console.log(workouts)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`http://localhost:8081/api/Get`);
        const data = await res.json();
        if (res.ok) {
          setWorkouts(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchItems();
  }, []);

  const handleDeleteUser = async (postId) => {
    try {
      const res = await fetch(`http://localhost:8081/api/delete/${postId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setWorkouts((prev) => prev.filter((workout) => workout.id !== postId));
        alert("Post deleted successfully");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`http://localhost:8081/api/like/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setWorkouts((prev) =>
          prev.map((w) =>
            w.id === postId ? { ...w, likes: w.likes + 1 } : w
          )
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      const res = await fetch(`http://localhost:8081/api/comment/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: commentText }),
      });
      if (res.ok) {
        alert("Comment added!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

 

 


  return (
    <div className="relative w-full">
    <img
      src="https://images.pexels.com/photos/34600/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      alt="Banner"
      className="w-full h-[700px] object-cover opacity-90"
    />
  
    <div className="absolute top-0 w-full px-4 py-6 bg-gradient-to-r from-[#686868] to-[#d4d5d65b] via-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-6">
          <Link to="/create">
            <button className="bg-blue-500 text-black border border-slate-300 rounded-lg px-6 py-2 shadow hover:bg-opacity-90">
              New post
            </button>
          </Link>
        </div>
  
        <div className="grid gap-10 max-h-[650px] scrollbar-none overflow-y-auto scrollbar-thin pr-2">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl mx-auto relative"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <img
                    src="https://images.pexels.com/photos/34600/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="User avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h1 className="text-slate-800 font-medium">user344</h1>
                    <p className="text-xs text-gray-500">
                      {moment(workout.created).format("YYYY-MM-DD HH:mm")}
                    </p>
                  </div>
                </div>
  
                <div className="flex items-center gap-3">
                  <Link to={`/updatepost/${workout.id}`}>
                    <img
                      src="https://icons.veryicon.com/png/o/miscellaneous/linear-small-icon/edit-246.png"
                      alt="Edit"
                      className="w-5 h-5"
                    />
                  </Link>
                  <button onClick={() => handleDeleteUser(workout.id)}>
                    <img
                      src="https://cdn.icon-icons.com/icons2/1157/PNG/512/1487086345-cross_81577.png"
                      alt="Delete"
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </div>
  
              <div className="mt-4">
                <p className="text-sm text-blue-700 font-medium">#post #popular</p>
                <p className="text-gray-800">{workout.title}</p>
              </div>
  
             
  
              {workout.image && (
                <img
                  src={workout.image[0]}
                  alt="Post visual"
                  className="mt-4 rounded-xl w-full h-80 object-cover"
                />
              )}
  
              <div className="mt-4 flex items-center gap-4">
                <button onClick={() => handleLike(workout.id)}>
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="text-red-600 text-2xl hover:text-red-400"
                  />
                </button>
                <span className="text-xs text-gray-500">{workout.likes} likes</span>
  
                <button onClick={() => setSelectedPostId(workout.id)}>
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT39MC8P4nQc7W1X59HDxu66eEfGlUfNURWjW7IIUuirA&s"
                    alt="Comment"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </button>
  
               
              </div>
  
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700">user344</h3>
                <p className="text-gray-600">{workout.content}</p>
              </div>
  
              {selectedPostId === workout.id && (
                <div className="mt-3 flex items-center gap-4">
                  <input
                    type="text"
                    value={commentText}
                    maxLength={20}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Comment..."
                    className="w-full h-10 px-4 text-sm rounded-full bg-slate-100 border border-gray-300"
                  />
                  <button
                    className="text-blue-600 font-medium"
                    onClick={() => handleComment(workout.id, commentText)}
                  >
                    Post
                  </button>
                </div>
              )}
  
              <div className="bg-slate-100 rounded-xl mt-4 p-3">
                <h4 className="text-sm text-gray-500 mb-2">Comments</h4>
                <div className="max-h-24 overflow-y-auto scrollbar-thin pr-1">
                  {workout.comments.map((comment, index) => (
                    <div key={index} className="mb-2">
                      <p className="text-sm text-gray-700">{comment.comment}</p>
                      <p className="text-[10px] text-gray-500">
                        {moment(comment.createdAt).fromNow()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {notification && (
          <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-md px-4 py-2 shadow-lg text-sm z-50">
            {notification}
          </div>
        )}
      </div>
    </div>
  </div>
  
  );
}
