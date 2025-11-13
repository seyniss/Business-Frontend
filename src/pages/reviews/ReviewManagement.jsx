import { useState } from 'react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import './ReviewManagement.scss'

const ReviewManagement = () => {
  const [reviews] = useState([
    {
      id: 1,
      guestName: '김철수',
      roomType: '디럭스 룸',
      rating: 5,
      comment: '정말 좋은 호텔이었습니다. 서비스도 훌륭하고 시설도 깨끗했어요.',
      date: '2025-11-10',
      status: 'approved',
    },
    {
      id: 2,
      guestName: '이영희',
      roomType: '오션뷰 스위트',
      rating: 4,
      comment: '뷰가 정말 아름답고 조용해서 휴식하기 좋았습니다.',
      date: '2025-11-09',
      status: 'approved',
    },
    {
      id: 3,
      guestName: '박민수',
      roomType: '스탠다드 룸',
      rating: 2,
      comment: '청결 상태가 좋지 않았고 직원들의 서비스도 아쉬웠습니다.',
      date: '2025-11-08',
      status: 'reported',
    },
  ])

  const getStatusText = (status) => {
    const statusMap = {
      approved: '승인됨',
      reported: '신고됨',
      pending: '대기 중',
    }
    return statusMap[status] || status
  }

  const getStatusClass = (status) => {
    return `review-status review-status--${status}`
  }

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  return (
    <div className="review-management">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>리뷰 관리</h1>
            <p>고객 리뷰를 확인하고 관리합니다</p>
          </div>
        </div>

        <Card title="리뷰 목록">
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-item__header">
                  <p className="review-item__author">
                    {review.guestName} · {review.roomType} · {review.date}
                  </p>
                  <span className={getStatusClass(review.status)}>
                    {getStatusText(review.status)}
                  </span>
                </div>

                <div className="review-item__rating">
                  <span className="stars">{getRatingStars(review.rating)}</span>
                  <span className="rating-value">{review.rating}/5</span>
                </div>

                <p className="review-item__comment">{review.comment}</p>

                <div className="review-item__actions">
                  {review.status === 'reported' && (
                    <>
                      <Button variant="secondary" size="small">
                        신고 확인
                      </Button>
                      <Button variant="danger" size="small">
                        리뷰 숨기기
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="small">
                    답글 작성
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ReviewManagement
