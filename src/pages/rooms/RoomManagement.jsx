import { useState } from 'react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import './RoomManagement.scss'

const RoomManagement = () => {
  const [rooms] = useState([
    {
      id: 1,
      hotelName: '그랜드 서울 호텔',
      roomType: '디럭스 룸',
      capacity: 2,
      price: 180000,
      available: 15,
      total: 20,
    },
    {
      id: 2,
      hotelName: '그랜드 서울 호텔',
      roomType: '스위트 룸',
      capacity: 4,
      price: 350000,
      available: 5,
      total: 10,
    },
  ])

  return (
    <div className="room-management">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>객실 관리</h1>
            <p>호텔 객실 정보 및 재고를 관리합니다</p>
          </div>
          <Button variant="primary">새 객실 타입 추가</Button>
        </div>

        <Card title="객실 목록">
          <div className="rooms-table">
            <table>
              <thead>
                <tr>
                  <th>호텔명</th>
                  <th>객실 타입</th>
                  <th>수용 인원</th>
                  <th>가격 (1박)</th>
                  <th>가용 객실</th>
                  <th>전체 객실</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.hotelName}</td>
                    <td>{room.roomType}</td>
                    <td>{room.capacity}인</td>
                    <td>{room.price.toLocaleString()}원</td>
                    <td>{room.available}</td>
                    <td>{room.total}</td>
                    <td>
                      <span
                        className={`status ${
                          room.available > 5 ? 'status--available' : 'status--low'
                        }`}
                      >
                        {room.available > 5 ? '충분' : '부족'}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <Button variant="secondary" size="small">
                          수정
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default RoomManagement
