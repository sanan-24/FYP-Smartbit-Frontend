import React, { useState, useEffect } from 'react';
import { Star, X, MessageSquare } from 'lucide-react';
import Button from './Button';
import reviewApi from '../api/review';

const ReviewModal = ({ isOpen, onClose, orderId, productId, riderId, type, itemName }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset state whenever the modal opens or the target changes
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setComment('');
      setError('');
      setHover(0);
    }
  }, [isOpen, productId, riderId]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await reviewApi.addReview({
        orderId,
        productId,
        riderId,
        rating,
        comment,
        type
      });
      onClose();
      // Optional: Show success toast
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-secondary-900 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl space-y-8 border border-white/5">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black dark:text-white tracking-tight">Rate your {type}</h3>
            <p className="text-xs text-secondary-500 font-bold uppercase tracking-widest mt-1">{itemName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
            <X className="h-6 w-6 dark:text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    className={`h-10 w-10 transition-colors ${
                      (hover || rating) >= star 
                      ? 'fill-primary-500 text-primary-500' 
                      : 'text-slate-200 dark:text-secondary-800'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-black text-primary-500 uppercase tracking-[0.2em]">
              {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : rating === 1 ? 'Poor' : 'Select Stars'}
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest flex items-center">
              <MessageSquare className="h-3 w-3 mr-2" /> Your Feedback (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              className="w-full bg-slate-50 dark:bg-secondary-850 border-none rounded-2xl p-4 text-sm dark:text-white focus:ring-2 focus:ring-primary-500 min-h-[120px] transition-all"
            />
          </div>

          {error && (
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">{error}</p>
          )}

          <Button
            type="submit"
            loading={loading}
            className="w-full py-5 rounded-2xl shadow-xl shadow-primary-500/20"
          >
            Submit Review
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
