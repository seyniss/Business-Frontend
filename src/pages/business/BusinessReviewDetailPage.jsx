import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { businessReviewApi } from "../../api/businessReviewApi";
import BusinessReviewDetail from "../../components/business/reviews/BusinessReviewDetail";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const BusinessReviewDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReview();
  }, [id]);

  const fetchReview = async () => {
    try {
      setLoading(true);
      const data = await businessReviewApi.getReviewById(id);
      setReview(data);
    } catch (err) {
      setError(err.message || "리뷰 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId, reply) => {
    try {
      await businessReviewApi.replyToReview(reviewId, reply);
      setAlertModal({ isOpen: true, message: "답변이 등록되었습니다.", type: "success" });
      fetchReview();
    } catch (err) {
      setAlertModal({ isOpen: true, message: "답변 등록에 실패했습니다.", type: "error" });
    }
  };

  const handleReport = async (reviewId) => {
    setConfirmDialog({ isOpen: true, reviewId });
  };

  const handleConfirmReport = async () => {
    if (confirmDialog.reviewId) {
      try {
        await businessReviewApi.reportReview(confirmDialog.reviewId, "부적절한 내용");
        setAlertModal({ isOpen: true, message: "리뷰가 신고되었습니다.", type: "success" });
        setConfirmDialog({ isOpen: false, reviewId: null });
        fetchReview();
      } catch (err) {
        setAlertModal({ isOpen: true, message: "신고에 실패했습니다.", type: "error" });
      }
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchReview} />;

  return (
    <div className="business-review-detail-page">
      <div className="page-header">
        <h1>리뷰 상세</h1>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          목록으로
        </button>
      </div>

      <div className="card">
        <BusinessReviewDetail
          review={review}
          onReply={handleReply}
          onReport={handleReport}
        />
      </div>

      <AlertModal
        isOpen={alertModal.isOpen}
        message={alertModal.message}
        type={alertModal.type}
        onClose={() => setAlertModal({ isOpen: false, message: "", type: "info" })}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="리뷰 신고"
        message="이 리뷰를 신고하시겠습니까?"
        onConfirm={handleConfirmReport}
        onCancel={() => setConfirmDialog({ isOpen: false, reviewId: null })}
      />
    </div>
  );
};

export default BusinessReviewDetailPage;
