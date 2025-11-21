import { useState, useEffect } from "react";
import { businessHotelApi } from "../../api/businessHotelApi";
import BusinessHotelSettingsForm from "../../components/business/settings/BusinessHotelSettingsForm";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import AlertModal from "../../components/common/AlertModal";

const BusinessSettingsPage = () => {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: "", type: "info" });

  useEffect(() => {
    fetchHotel();
  }, []);

  const fetchHotel = async () => {
    try {
      setLoading(true);
      const data = await businessHotelApi.getMyHotel();
      setHotel(data);
    } catch (err) {
      setError(err.message || "호텔 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      await businessHotelApi.updateHotel(data);
      setAlertModal({ isOpen: true, message: "호텔 정보가 저장되었습니다.", type: "success" });
      fetchHotel();
    } catch (err) {
      setAlertModal({ isOpen: true, message: "저장에 실패했습니다.", type: "error" });
    }
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchHotel} />;

  return (
    <div className="business-settings-page">
      <div className="page-header">
        <h1>호텔 설정</h1>
      </div>

      <div className="card">
        <BusinessHotelSettingsForm hotel={hotel} onSubmit={handleSubmit} />
      </div>

      <AlertModal
        isOpen={alertModal.isOpen}
        message={alertModal.message}
        type={alertModal.type}
        onClose={() => setAlertModal({ isOpen: false, message: "", type: "info" })}
      />
    </div>
  );
};

export default BusinessSettingsPage;
