import { useState, useEffect } from "react";
import { businessReviewApi } from "../../api/businessReviewApi";

const BusinessReviewListPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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

              <div style={{ display: "flex", gap: "0.5rem" }}>
                {review.status === "reported" && (
                  <>
                    <button className="btn btn-outline">신고 확인</button>
                    <button className="btn btn-danger">리뷰 숨기기</button>
                  </>
                )}
                <button className="btn btn-outline">답글 작성</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessReviewListPage;
