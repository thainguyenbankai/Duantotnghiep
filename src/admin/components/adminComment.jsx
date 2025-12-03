import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('https://new-server-e.onrender.com/api/comment/list');

      const commentsData = response.data?.data?.data || [];
      console.log(commentsData ,'commet');
      
      setComments(Array.isArray(commentsData) ? commentsData : []);

    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err.message);
      toast.error('Failed to load comments');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await axios.delete(`https://new-server-e.onrender.com/api/comment/delete/${commentId}`);

      setComments(prevComments =>
        prevComments.filter(comment => comment._id !== commentId)
      );

      toast.success('Comment deleted successfully!');
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast.error('Failed to delete comment');
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        <div className="text-center py-8 text-red-500">Failed to load comments</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Comments ({Array.isArray(comments) ? comments.length : 0})</h2>

      {!Array.isArray(comments) || comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No comments available</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">User</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Content</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Product ID</th>
               <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>

                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment, index) => (
                <tr key={comment._id || index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {comment.commenter?.firstName} {comment.commenter?.lastName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {comment.content || 'No content'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {comment.productId || 'N/A'}
                  </td>
                   <td className="border border-gray-300 px-4 py-2">
                    {comment.productName || 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}