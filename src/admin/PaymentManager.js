import React, { useState } from "react";
import { PRICING, ADMIN_CONFIG } from "../config/supabase";

const PaymentManager = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      user_name: "John Doe",
      user_email: "john@example.com",
      plan: "Premium",
      amount: PRICING.PREMIUM,
      status: "pending",
      payment_method: "GoPay",
      created_at: "2024-07-04T10:30:00Z",
      proof_url: null,
    },
    {
      id: 2,
      user_name: "Jane Smith",
      user_email: "jane@example.com",
      plan: "VIP",
      amount: PRICING.VIP,
      status: "confirmed",
      payment_method: "Bank Transfer",
      created_at: "2024-07-03T15:45:00Z",
      confirmed_at: "2024-07-03T16:00:00Z",
    },
  ]);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleConfirmPayment = (paymentId) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              status: "confirmed",
              confirmed_at: new Date().toISOString(),
            }
          : payment,
      ),
    );
    alert("Pembayaran dikonfirmasi! User akan mendapat akses premium.");
  };

  const handleRejectPayment = (paymentId) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              status: "rejected",
              rejected_at: new Date().toISOString(),
            }
          : payment,
      ),
    );
    alert("Pembayaran ditolak.");
  };

  const getTotalRevenue = () => {
    return payments
      .filter((p) => p.status === "confirmed")
      .reduce((total, payment) => total + payment.amount, 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ff9800";
      case "confirmed":
        return "#4caf50";
      case "rejected":
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Menunggu Konfirmasi";
      case "confirmed":
        return "Terkonfirmasi";
      case "rejected":
        return "Ditolak";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div style={styles.header}>
        <h3 style={styles.title}>💳 Manajemen Pembayaran</h3>
        <div style={styles.revenue}>
          <span style={styles.revenueLabel}>Total Revenue:</span>
          <span style={styles.revenueAmount}>
            Rp {getTotalRevenue().toLocaleString()}
          </span>
        </div>
      </div>

      {/* Payment Methods Info */}
      <div className="card" style={styles.paymentInfo}>
        <h4 style={styles.infoTitle}>Informasi Metode Pembayaran</h4>
        <div style={styles.methodsGrid}>
          <div style={styles.methodItem}>
            <i className="fas fa-mobile-alt" style={styles.methodIcon}></i>
            <div>
              <div style={styles.methodTitle}>GoPay</div>
              <div style={styles.methodNumber}>
                {ADMIN_CONFIG.PAYMENT_METHODS.GOPAY}
              </div>
            </div>
          </div>
          <div style={styles.methodItem}>
            <i className="fab fa-whatsapp" style={styles.methodIcon}></i>
            <div>
              <div style={styles.methodTitle}>WhatsApp Admin</div>
              <div style={styles.methodNumber}>
                {ADMIN_CONFIG.PAYMENT_METHODS.WHATSAPP}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div style={styles.statsGrid}>
        <StatCard
          icon="fas fa-clock"
          title="Pending"
          value={payments.filter((p) => p.status === "pending").length}
          color="#ff9800"
        />
        <StatCard
          icon="fas fa-check-circle"
          title="Confirmed"
          value={payments.filter((p) => p.status === "confirmed").length}
          color="#4caf50"
        />
        <StatCard
          icon="fas fa-times-circle"
          title="Rejected"
          value={payments.filter((p) => p.status === "rejected").length}
          color="#f44336"
        />
        <StatCard
          icon="fas fa-money-bill-wave"
          title="Total Payments"
          value={payments.length}
          color="#2196f3"
        />
      </div>

      {/* Payments List */}
      <div style={styles.paymentsList}>
        <h4 style={styles.listTitle}>Daftar Pembayaran</h4>

        {payments.length === 0 ? (
          <div className="card" style={styles.emptyState}>
            <i className="fas fa-receipt" style={styles.emptyIcon}></i>
            <h4>Belum ada pembayaran</h4>
            <p>Pembayaran dari user akan muncul di sini</p>
          </div>
        ) : (
          <div style={styles.paymentsGrid}>
            {payments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onConfirm={() => handleConfirmPayment(payment.id)}
                onReject={() => handleRejectPayment(payment.id)}
                onViewDetail={() => {
                  setSelectedPayment(payment);
                  setShowDetail(true);
                }}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Payment Detail Modal */}
      {showDetail && selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          onClose={() => {
            setShowDetail(false);
            setSelectedPayment(null);
          }}
          onConfirm={() => {
            handleConfirmPayment(selectedPayment.id);
            setShowDetail(false);
            setSelectedPayment(null);
          }}
          onReject={() => {
            handleRejectPayment(selectedPayment.id);
            setShowDetail(false);
            setSelectedPayment(null);
          }}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className="card" style={styles.statCard}>
    <div style={{ ...styles.statIcon, color }}>
      <i className={icon}></i>
    </div>
    <div style={styles.statContent}>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statTitle}>{title}</div>
    </div>
  </div>
);

const PaymentCard = ({
  payment,
  onConfirm,
  onReject,
  onViewDetail,
  getStatusColor,
  getStatusText,
  formatDate,
}) => (
  <div className="card" style={styles.paymentCard}>
    <div style={styles.cardHeader}>
      <div style={styles.userInfo}>
        <h4 style={styles.userName}>{payment.user_name}</h4>
        <p style={styles.userEmail}>{payment.user_email}</p>
      </div>
      <span
        style={{
          ...styles.statusBadge,
          backgroundColor: getStatusColor(payment.status),
        }}
      >
        {getStatusText(payment.status)}
      </span>
    </div>

    <div style={styles.paymentDetails}>
      <div style={styles.detailRow}>
        <span style={styles.detailLabel}>Paket:</span>
        <span style={styles.detailValue}>{payment.plan}</span>
      </div>
      <div style={styles.detailRow}>
        <span style={styles.detailLabel}>Jumlah:</span>
        <span style={styles.detailValue}>
          Rp {payment.amount.toLocaleString()}
        </span>
      </div>
      <div style={styles.detailRow}>
        <span style={styles.detailLabel}>Metode:</span>
        <span style={styles.detailValue}>{payment.payment_method}</span>
      </div>
      <div style={styles.detailRow}>
        <span style={styles.detailLabel}>Tanggal:</span>
        <span style={styles.detailValue}>{formatDate(payment.created_at)}</span>
      </div>
    </div>

    <div style={styles.cardActions}>
      <button
        onClick={onViewDetail}
        className="btn btn-secondary"
        style={styles.actionButton}
      >
        <i className="fas fa-eye"></i>
        Detail
      </button>

      {payment.status === "pending" && (
        <>
          <button
            onClick={onConfirm}
            className="btn btn-primary"
            style={styles.actionButton}
          >
            <i className="fas fa-check"></i>
            Konfirmasi
          </button>
          <button
            onClick={onReject}
            className="btn btn-danger"
            style={styles.actionButton}
          >
            <i className="fas fa-times"></i>
            Tolak
          </button>
        </>
      )}
    </div>
  </div>
);

const PaymentDetailModal = ({
  payment,
  onClose,
  onConfirm,
  onReject,
  getStatusColor,
  getStatusText,
  formatDate,
}) => (
  <div style={styles.modalOverlay}>
    <div style={styles.modal} className="card">
      <div style={styles.modalHeader}>
        <h3 style={styles.modalTitle}>Detail Pembayaran</h3>
        <button onClick={onClose} style={styles.closeButton}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div style={styles.modalContent}>
        <div style={styles.paymentSummary}>
          <div style={styles.summaryRow}>
            <span>Nama User:</span>
            <span>
              <strong>{payment.user_name}</strong>
            </span>
          </div>
          <div style={styles.summaryRow}>
            <span>Email:</span>
            <span>{payment.user_email}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Paket:</span>
            <span>
              <strong>{payment.plan}</strong>
            </span>
          </div>
          <div style={styles.summaryRow}>
            <span>Jumlah:</span>
            <span>
              <strong>Rp {payment.amount.toLocaleString()}</strong>
            </span>
          </div>
          <div style={styles.summaryRow}>
            <span>Metode Pembayaran:</span>
            <span>{payment.payment_method}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Status:</span>
            <span
              style={{
                color: getStatusColor(payment.status),
                fontWeight: "600",
              }}
            >
              {getStatusText(payment.status)}
            </span>
          </div>
          <div style={styles.summaryRow}>
            <span>Tanggal Permintaan:</span>
            <span>{formatDate(payment.created_at)}</span>
          </div>
          {payment.confirmed_at && (
            <div style={styles.summaryRow}>
              <span>Tanggal Konfirmasi:</span>
              <span>{formatDate(payment.confirmed_at)}</span>
            </div>
          )}
        </div>

        {payment.proof_url && (
          <div style={styles.proofSection}>
            <h4>Bukti Pembayaran</h4>
            <img
              src={payment.proof_url}
              alt="Bukti Pembayaran"
              style={styles.proofImage}
            />
          </div>
        )}

        <div style={styles.contactInfo}>
          <h4>Kontak User</h4>
          <div style={styles.contactMethods}>
            <button
              className="btn btn-secondary"
              onClick={() =>
                window.open(`mailto:${payment.user_email}`, "_blank")
              }
              style={styles.contactButton}
            >
              <i className="fas fa-envelope"></i>
              Email User
            </button>
            <button
              className="btn btn-secondary"
              onClick={() =>
                window.open(
                  `https://wa.me/6285810526151?text=Halo ${payment.user_name}, terkait pembayaran ${payment.plan}...`,
                  "_blank",
                )
              }
              style={styles.contactButton}
            >
              <i className="fab fa-whatsapp"></i>
              WhatsApp
            </button>
          </div>
        </div>
      </div>

      {payment.status === "pending" && (
        <div style={styles.modalActions}>
          <button onClick={onClose} className="btn btn-secondary">
            Tutup
          </button>
          <button onClick={onReject} className="btn btn-danger">
            <i className="fas fa-times"></i>
            Tolak Pembayaran
          </button>
          <button onClick={onConfirm} className="btn btn-primary">
            <i className="fas fa-check"></i>
            Konfirmasi Pembayaran
          </button>
        </div>
      )}
    </div>
  </div>
);

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },
  revenue: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  revenueLabel: {
    fontSize: "0.9rem",
    opacity: 0.7,
  },
  revenueAmount: {
    fontSize: "1.5rem",
    fontWeight: "700",
    background: "linear-gradient(45deg, #4caf50, #8bc34a)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  paymentInfo: {
    padding: "20px",
    marginBottom: "25px",
  },
  infoTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "15px",
  },
  methodsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  },
  methodItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "8px",
  },
  methodIcon: {
    fontSize: "1.5rem",
    color: "#4caf50",
  },
  methodTitle: {
    fontWeight: "500",
    marginBottom: "2px",
  },
  methodNumber: {
    fontSize: "0.9rem",
    opacity: 0.8,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "20px",
  },
  statIcon: {
    fontSize: "2rem",
    minWidth: "50px",
    textAlign: "center",
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "5px",
  },
  statTitle: {
    fontSize: "0.9rem",
    opacity: 0.7,
  },
  paymentsList: {
    marginBottom: "30px",
  },
  listTitle: {
    fontSize: "1.3rem",
    fontWeight: "600",
    marginBottom: "20px",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
  },
  emptyIcon: {
    fontSize: "3rem",
    marginBottom: "15px",
    opacity: 0.5,
  },
  paymentsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "20px",
  },
  paymentCard: {
    padding: "20px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "3px",
  },
  userEmail: {
    fontSize: "0.9rem",
    opacity: 0.7,
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "white",
  },
  paymentDetails: {
    marginBottom: "15px",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  detailLabel: {
    fontSize: "0.9rem",
    opacity: 0.7,
  },
  detailValue: {
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  cardActions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  actionButton: {
    padding: "6px 12px",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
    padding: "20px",
  },
  modal: {
    maxWidth: "600px",
    width: "100%",
    maxHeight: "90vh",
    overflow: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    margin: 0,
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "1.5rem",
    cursor: "pointer",
    padding: "5px",
  },
  modalContent: {
    marginBottom: "25px",
  },
  paymentSummary: {
    background: "rgba(255,255,255,0.1)",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "0.95rem",
  },
  proofSection: {
    marginBottom: "20px",
  },
  proofImage: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  contactInfo: {
    background: "rgba(255,255,255,0.05)",
    padding: "15px",
    borderRadius: "8px",
  },
  contactMethods: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  contactButton: {
    padding: "8px 15px",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  modalActions: {
    display: "flex",
    gap: "15px",
    justifyContent: "flex-end",
  },
};

export default PaymentManager;
