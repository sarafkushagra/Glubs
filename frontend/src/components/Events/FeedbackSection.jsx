import { useState } from "react";
import { MessageSquare, Plus, Star } from "lucide-react";
import axios from "axios";

const FeedbackSection = ({ eventId, feedbacks, user, isDarkMode, themeClasses, renderStars, fetchFeedbacks }) => {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating || !review.trim()) return alert("Please provide rating and review");

    setSubmitting(true);
    try {
      await axios.post("http://localhost:3000/feedback", {
        event: eventId,
        rating,
        review,
        user: user._id,
      });

      setShowForm(false);
      setRating(0);
      setReview("");
      fetchFeedbacks(); // Refresh list
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`${themeClasses.card} border rounded-2xl p-8 relative`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-6 h-6 text-indigo-500" />
        <h2 className={`text-2xl font-bold ${themeClasses.text}`}>User Feedback</h2>
      </div>

      {/* Add Feedback Button */}
      {user && (
        <button
          onClick={() => setShowForm(true)}
          className="absolute top-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md transition"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}

      {/* Feedback List */}
      {feedbacks.length > 0 ? (
        <div className="space-y-4 hide-scrollbar">
          {feedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className={`p-6 ${isDarkMode ? "bg-gray-800/30 border-gray-700/50" : "bg-gray-50 border-gray-200"} border rounded-xl`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className={`font-semibold ${themeClasses.text}`}>
                    {feedback.user?.username || "Anonymous"}
                  </div>
                  <div className={`text-sm ${themeClasses.textMuted}`}>
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(feedback.rating)}
                  <span className={`ml-2 text-sm font-medium ${themeClasses.textSecondary}`}>
                    {feedback.rating}/5
                  </span>
                </div>
              </div>
              <p className={`${themeClasses.textSecondary} mb-4`}>{feedback.review}</p>
              {user && feedback.user && feedback.user._id === user._id && (
                <button
                  onClick={() => handleDeleteFeedback(feedback._id)}
                  className="text-red-500 hover:text-red-400 hover:underline text-sm transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${themeClasses.textMuted}`} />
          <p className={`${themeClasses.textMuted} text-lg`}>No feedback yet</p>
          <p className={`${themeClasses.textMuted}`}>Be the first to share your thoughts!</p>
        </div>
      )}

      {/* Add Feedback Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className={`w-full max-w-md bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg relative`}>
            <h3 className="text-xl font-semibold mb-4 text-center text-indigo-600">Add Feedback</h3>

            {/* Rating Input */}
            <div className="flex items-center gap-2 justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer transition-colors ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                  onClick={() => setRating(star)}
                  fill={star <= rating ? "currentColor" : "none"}
                />
              ))}
            </div>

            {/* Review Textarea */}
            <textarea
              className="w-full border rounded-lg p-3 text-sm resize-none h-28 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Write your feedback here..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {submitting ? "Saving..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackSection;
