import { useState, useEffect } from "react";
import { businessReviewApi } from "../../api/businessReviewApi";

const BusinessReviewListPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyModal, setReplyModal] = useState({ open: false, reviewId: null, replyText: "" });
  const [reportModal, setReportModal] = useState({ open: false, reviewId: null, reason: "" });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await businessReviewApi.getReviews();
      setReviews(data.reviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (reviewId, replyText) => {
    try {
      await businessReviewApi.replyToReview(reviewId, replyText);
      alert("답변이 등록되었습니다.");
      setReplyModal({ open: false, reviewId: null, replyText: "" });
      fetchReviews();
    } catch (error) {
      alert("답변 등록에 실패했습니다.");
    }
  };

  const handleReportSubmit = async (reviewId, reason) => {
    if (!reason.trim()) {
      alert("신고 사유를 입력해주세요.");
      return;
    }
    try {
      await businessReviewApi.reportReview(reviewId, reason);
      alert("리뷰가 신고되었습니다.");
      setReportModal({ open: false, reviewId: null, reason: "" });
      fetchReviews();
    } catch (error) {
      alert("신고 처리에 실패했습니다.");
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      approved: "승인됨",
      reported: "신고됨",
      pending: "대기 중",
    };
    return statusMap[status] || status;
  };

  const getRatingStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>리뷰 관리</h1>
          <p>고객 리뷰를 확인하고 관리합니다</p>
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <h3>리뷰 목록</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                padding: "1rem",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
                  {review.guestName} · {review.roomType} · {review.date}
                </p>
                <span className={`status-badge ${review.status}`}>
                  {getStatusText(review.status)}
                </span>
              </div>

              <div style={{ marginBottom: "0.5rem" }}>
                <span style={{ color: "#f59e0b", marginRight: "0.5rem" }}>
                  {getRatingStars(review.rating)}
                </span>
                <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
                  {review.rating}/5
                </span>
              </div>

              <p style={{ fontSize: "0.875rem", color: "#0f172a", marginBottom: "1rem" }}>
                {review.comment}
              </p>

              {review.reply && (
                <div
                  style={{
                    padding: "0.75rem",
                    background: "#f1f5f9",
                    borderRadius: "6px",
                    marginBottom: "1rem",
                  }}
                >
                  <p style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem" }}>
                    사업자 답변
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#0f172a" }}>{review.reply}</p>
                </div>
              )}

              <div style={{ display: "flex", gap: "0.5rem" }}>
                {!review.reply && (
                  <button
                    className="btn btn-outline"
                    onClick={() => setReplyModal({ open: true, reviewId: review.id, replyText: "" })}
                  >
                    답글 작성
                  </button>
                )}
                {review.status !== "reported" && (
                  <button
                    className="btn btn-danger"
                    onClick={() => setReportModal({ open: true, reviewId: review.id, reason: "" })}
                  >
                    신고하기
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 답글 작성 모달 */}
      {replyModal.open && (
        <div className="modal-overlay" onClick={() => setReplyModal({ open: false, reviewId: null, replyText: "" })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>답글 작성</h3>
            <textarea
              value={replyModal.replyText}
              onChange={(e) => setReplyModal({ ...replyModal, replyText: e.target.value })}
              placeholder="리뷰에 대한 답변을 작성하세요..."
              rows={6}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "0.875rem",
                fontFamily: "inherit",
                resize: "vertical",
                marginBottom: "1rem",
              }}
            />
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setReplyModal({ open: false, reviewId: null, replyText: "" })}
              >
                취소
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleReplySubmit(replyModal.reviewId, replyModal.replyText)}
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 신고하기 모달 */}
      {reportModal.open && (
        <div className="modal-overlay" onClick={() => setReportModal({ open: false, reviewId: null, reason: "" })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>리뷰 신고</h3>
            <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "1rem" }}>
              신고 사유를 입력해주세요.
            </p>
            <textarea
              value={reportModal.reason}
              onChange={(e) => setReportModal({ ...reportModal, reason: e.target.value })}
              placeholder="신고 사유를 상세히 작성해주세요..."
              rows={6}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "0.875rem",
                fontFamily: "inherit",
                resize: "vertical",
                marginBottom: "1rem",
              }}
            />
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setReportModal({ open: false, reviewId: null, reason: "" })}
              >
                취소
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleReportSubmit(reportModal.reviewId, reportModal.reason)}
              >
                신고하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessReviewListPage;
