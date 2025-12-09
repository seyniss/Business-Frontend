import { useState, useEffect } from "react";
import { businessBookingApi } from "../../api/businessBookingApi";
import BusinessBookingFilter from "../../components/business/bookings/BusinessBookingFilter";
import BusinessBookingTable from "../../components/business/bookings/BusinessBookingTable";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import AlertModal from "../../components/common/AlertModal";

const BusinessBookingListPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [filterInputs, setFilterInputs] = useState(filters);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: "", type: "info" });

  useEffect(() => {
    fetchBookings();
  }, [filters, currentPage]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await businessBookingApi.getBookings({
        ...filters,
        page: currentPage,
      });
      // 백엔드 응답 구조: { data: [...] } 배열 직접 반환
      // 백엔드 명세서에 따르면 data 배열 직접 반환
      const bookingsData = response?.data || response?.bookings || response || [];
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      // 페이지네이션 정보는 별도 필드로 전달될 수 있음
      setTotalPages(response?.totalPages || response?.pagination?.totalPages || 1);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "예약 목록을 불러오는데 실패했습니다.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterInputChange = (key, value) => {
    setFilterInputs((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(filterInputs);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    const initial = { search: "", status: "", startDate: "", endDate: "" };
    setFilterInputs(initial);
    setFilters(initial);
    setCurrentPage(1);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await businessBookingApi.updateBookingStatus(id, status);
      fetchBookings();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "상태 변경에 실패했습니다.";
      setAlertModal({ isOpen: true, message: errorMessage, type: "error" });
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchBookings} />;

  return (
    <div className="business-booking-list-page">
      <div className="page-header">
        <h1>예약 관리</h1>
      </div>

      <BusinessBookingFilter
        values={filterInputs}
        onChange={handleFilterInputChange}
        onSearch={applyFilters}
        onReset={resetFilters}
      />

      {bookings.length === 0 ? (
        <EmptyState message="예약 내역이 없습니다." />
      ) : (
        <>
          <div className="card">
            <BusinessBookingTable
              bookings={bookings}
              onStatusChange={handleStatusChange}
            />
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <AlertModal
        isOpen={alertModal.isOpen}
        message={alertModal.message}
        type={alertModal.type}
        onClose={() => setAlertModal({ isOpen: false, message: "", type: "info" })}
      />
    </div>
  );
};

export default BusinessBookingListPage;
