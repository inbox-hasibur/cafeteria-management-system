import { useEffect } from "react";
import api from "../../utils/api";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const response = await api.post("/api/orders/verify", { success, orderId });
      if (response.data.success) {
        toast.success(response.data.message || "Payment Successful!");
        navigate("/myorders");
      } else {
        toast.error(response.data.message || "Payment Failed");
        navigate("/");
      }
    } catch (error) {
      toast.error("Error verifying payment");
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
