import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { tournamentService } from "../services/database";
import { PRICING } from "../config/supabase";

const TournamentPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    phone: "",
    emergency_contact: "",
    song_preference: "",
    experience_level: "Beginner",
  });

  // Mock tournaments data
  const mockTournaments = [
    {
      id: 1,
      title: "Weekly Challenge #8",
      description: "Kompetisi karaoke mingguan dengan tema lagu pop Indonesia",
      start_date: "2024-07-15T19:00:00Z",
      end_date: "2024-07-21T23:59:59Z",
      entry_fee: PRICING.TOURNAMENT_ENTRY,
      max_participants: 50,
      current_participants: 23,
      prize_pool: 500000,
      status: "registration_open",
      rules: [
        "Peserta harus menyanyikan minimal 2 lagu",
        "Tema: Lagu Pop Indonesia",
        "Durasi maksimal per lagu: 5 menit",
        "Penilaian berdasarkan akurasi pitch dan performa",
      ],
      prizes: [
        { position: 1, prize: "Rp 300.000 + Trophy" },
        { position: 2, prize: "Rp 150.000 + Medal" },
        { position: 3, prize: "Rp 50.000 + Certificate" },
      ],
    },
    {
      id: 2,
      title: "Monthly Championship",
      description:
        "Tournament bulanan dengan hadiah besar untuk semua genre musik",
      start_date: "2024-08-01T10:00:00Z",
      end_date: "2024-08-31T23:59:59Z",
      entry_fee: 15000,
      max_participants: 100,
      current_participants: 67,
      prize_pool: 2000000,
      status: "registration_open",
      rules: [
        "Peserta harus menyanyikan 3 lagu dari genre berbeda",
        "Bebas memilih lagu apapun",
        "Live performance via video call",
        "Juri professional dari industri musik",
      ],
      prizes: [
        { position: 1, prize: "Rp 1.000.000 + Recording Session" },
        { position: 2, prize: "Rp 600.000 + Equipment Voucher" },
        { position: 3, prize: "Rp 400.000 + Premium Subscription" },
      ],
    },
    {
      id: 3,
      title: "Duet Battle",
      description: "Kompetisi duet terbaik dengan pasangan pilihan Anda",
      start_date: "2024-07-20T15:00:00Z",
      end_date: "2024-07-27T23:59:59Z",
      entry_fee: 10000,
      max_participants: 40,
      current_participants: 18,
      prize_pool: 800000,
      status: "coming_soon",
      rules: [
        "Peserta harus berpasangan (2 orang)",
        "Menyanyikan 2 lagu duet",
        "Harmoni dan chemistry menjadi penilaian utama",
        "Boleh pasangan dari luar platform",
      ],
      prizes: [
        { position: 1, prize: "Rp 400.000 (dibagi 2) + Duet Trophy" },
        { position: 2, prize: "Rp 250.000 (dibagi 2) + Medal" },
        { position: 3, prize: "Rp 150.000 (dibagi 2) + Certificate" },
      ],
    },
  ];

  useEffect(() => {
    setTournaments(mockTournaments);
  }, []);

  const handleRegister = async (tournament) => {
    setSelectedTournament(tournament);
    setShowRegistration(true);
  };

  const submitRegistration = async () => {
    try {
      // In real app, this would process payment and register user
      alert(
        `Pendaftaran berhasil untuk ${selectedTournament.title}!\n\nSilakan lakukan pembayaran sebesar Rp ${selectedTournament.entry_fee.toLocaleString()} melalui:\n\nGoPay: 0895340205302\nWhatsApp: 085810526151\n\nKonfirmasi pembayaran akan dikirim via WhatsApp.`,
      );

      // Redirect to WhatsApp for payment confirmation
      const message = `Halo Admin, saya ingin mendaftar tournament "${selectedTournament.title}" dengan biaya Rp ${selectedTournament.entry_fee.toLocaleString()}. Nama: ${user.user_metadata?.full_name || user.email}`;
      const whatsappUrl = `https://wa.me/6285810526151?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

      setShowRegistration(false);
      setSelectedTournament(null);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Pendaftaran gagal. Silakan coba lagi.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "registration_open":
        return "#4caf50";
      case "ongoing":
        return "#ff9800";
      case "completed":
        return "#9e9e9e";
      case "coming_soon":
        return "#2196f3";
      default:
        return "#9e9e9e";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "registration_open":
        return "Pendaftaran Dibuka";
      case "ongoing":
        return "Sedang Berlangsung";
      case "completed":
        return "Selesai";
      case "coming_soon":
        return "Segera Hadir";
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
    <div style={styles.container} className="fade-in">
      <div className="container">
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>🏆 Tournament Karaoke</h1>
          <p style={styles.subtitle}>
            Kompetisi karaoke dengan hadiah menarik!
          </p>
        </div>

        {/* Tournament Cards */}
        <div style={styles.tournamentGrid}>
          {tournaments.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
              onRegister={() => handleRegister(tournament)}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              formatDate={formatDate}
            />
          ))}
        </div>

        {/* Registration Modal */}
        {showRegistration && selectedTournament && (
          <RegistrationModal
            tournament={selectedTournament}
            registrationData={registrationData}
            setRegistrationData={setRegistrationData}
            onSubmit={submitRegistration}
            onClose={() => {
              setShowRegistration(false);
              setSelectedTournament(null);
            }}
          />
        )}

        {/* Tournament Rules & Info */}
        <div style={styles.infoSection}>
          <h2 style={styles.sectionTitle}>📋 Informasi Tournament</h2>

          <div style={styles.infoGrid}>
            <InfoCard
              icon="fas fa-trophy"
              title="Cara Mengikuti"
              content={[
                "Daftar dengan mengisi formulir",
                "Bayar biaya pendaftaran",
                "Tunggu konfirmasi via WhatsApp",
                "Ikuti jadwal yang ditentukan",
                "Berikan performa terbaik!",
              ]}
            />

            <InfoCard
              icon="fas fa-star"
              title="Kriteria Penilaian"
              content={[
                "Akurasi pitch (30%)",
                "Timing & rhythm (25%)",
                "Ekspresi & performa (25%)",
                "Kreativitas (20%)",
              ]}
            />

            <InfoCard
              icon="fas fa-gift"
              title="Hadiah & Reward"
              content={[
                "Uang tunai untuk juara",
                "Trophy & sertifikat",
                "Premium subscription",
                "Recording session gratis",
                "Equipment voucher",
              ]}
            />
          </div>
        </div>

        {/* Contact Admin */}
        <div style={styles.contactSection}>
          <div className="card" style={styles.contactCard}>
            <h3 style={styles.contactTitle}>💬 Butuh Bantuan?</h3>
            <p style={styles.contactText}>
              Hubungi admin untuk informasi lebih lanjut tentang tournament
            </p>
            <button
              className="btn btn-primary"
              onClick={() =>
                window.open("https://wa.me/6285810526151", "_blank")
              }
              style={styles.contactButton}
            >
              <i className="fab fa-whatsapp"></i>
              WhatsApp Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TournamentCard = ({
  tournament,
  onRegister,
  getStatusColor,
  getStatusText,
  formatDate,
}) => (
  <div className="card" style={styles.tournamentCard}>
    {/* Header */}
    <div style={styles.cardHeader}>
      <div style={styles.cardTitle}>
        <h3 style={styles.tournamentTitle}>{tournament.title}</h3>
        <span
          style={{
            ...styles.statusBadge,
            backgroundColor: getStatusColor(tournament.status),
          }}
        >
          {getStatusText(tournament.status)}
        </span>
      </div>
      <p style={styles.tournamentDesc}>{tournament.description}</p>
    </div>

    {/* Tournament Info */}
    <div style={styles.tournamentInfo}>
      <div style={styles.infoRow}>
        <i className="fas fa-calendar" style={styles.infoIcon}></i>
        <div>
          <div style={styles.infoLabel}>Tanggal</div>
          <div style={styles.infoValue}>
            {formatDate(tournament.start_date)} -{" "}
            {formatDate(tournament.end_date)}
          </div>
        </div>
      </div>

      <div style={styles.infoRow}>
        <i className="fas fa-money-bill-wave" style={styles.infoIcon}></i>
        <div>
          <div style={styles.infoLabel}>Biaya Pendaftaran</div>
          <div style={styles.infoValue}>
            Rp {tournament.entry_fee.toLocaleString()}
          </div>
        </div>
      </div>

      <div style={styles.infoRow}>
        <i className="fas fa-users" style={styles.infoIcon}></i>
        <div>
          <div style={styles.infoLabel}>Peserta</div>
          <div style={styles.infoValue}>
            {tournament.current_participants} / {tournament.max_participants}
          </div>
        </div>
      </div>

      <div style={styles.infoRow}>
        <i className="fas fa-gift" style={styles.infoIcon}></i>
        <div>
          <div style={styles.infoLabel}>Total Hadiah</div>
          <div style={styles.infoValue}>
            Rp {tournament.prize_pool.toLocaleString()}
          </div>
        </div>
      </div>
    </div>

    {/* Prizes */}
    <div style={styles.prizesSection}>
      <h4 style={styles.prizesTitle}>🏆 Hadiah</h4>
      <div style={styles.prizesList}>
        {tournament.prizes.map((prize, index) => (
          <div key={index} style={styles.prizeItem}>
            <span style={styles.prizePosition}>#{prize.position}</span>
            <span style={styles.prizeReward}>{prize.prize}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Action Button */}
    <div style={styles.cardActions}>
      <button
        onClick={onRegister}
        disabled={tournament.status !== "registration_open"}
        className={`btn ${tournament.status === "registration_open" ? "btn-primary" : "btn-secondary"}`}
        style={styles.registerButton}
      >
        {tournament.status === "registration_open" ? (
          <>
            <i className="fas fa-pen"></i> Daftar Sekarang
          </>
        ) : tournament.status === "coming_soon" ? (
          <>
            <i className="fas fa-clock"></i> Segera Hadir
          </>
        ) : (
          <>
            <i className="fas fa-eye"></i> Lihat Detail
          </>
        )}
      </button>
    </div>
  </div>
);

const InfoCard = ({ icon, title, content }) => (
  <div className="card" style={styles.infoCard}>
    <div style={styles.infoCardIcon}>
      <i className={icon}></i>
    </div>
    <h4 style={styles.infoCardTitle}>{title}</h4>
    <ul style={styles.infoCardList}>
      {content.map((item, index) => (
        <li key={index} style={styles.infoCardItem}>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const RegistrationModal = ({
  tournament,
  registrationData,
  setRegistrationData,
  onSubmit,
  onClose,
}) => (
  <div style={styles.modalOverlay}>
    <div style={styles.modal} className="card">
      <div style={styles.modalHeader}>
        <h3 style={styles.modalTitle}>Daftar Tournament</h3>
        <button onClick={onClose} style={styles.closeButton}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div style={styles.modalContent}>
        <div style={styles.tournamentSummary}>
          <h4>{tournament.title}</h4>
          <p>Biaya: Rp {tournament.entry_fee.toLocaleString()}</p>
        </div>

        <form style={styles.registrationForm}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nomor Telepon *</label>
            <input
              type="tel"
              value={registrationData.phone}
              onChange={(e) =>
                setRegistrationData((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
              style={styles.input}
              placeholder="08xxxxxxxxxx"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Kontak Darurat *</label>
            <input
              type="tel"
              value={registrationData.emergency_contact}
              onChange={(e) =>
                setRegistrationData((prev) => ({
                  ...prev,
                  emergency_contact: e.target.value,
                }))
              }
              style={styles.input}
              placeholder="Nomor keluarga/teman"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Preferensi Lagu</label>
            <input
              type="text"
              value={registrationData.song_preference}
              onChange={(e) =>
                setRegistrationData((prev) => ({
                  ...prev,
                  song_preference: e.target.value,
                }))
              }
              style={styles.input}
              placeholder="Genre atau lagu favorit"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Level Pengalaman</label>
            <select
              value={registrationData.experience_level}
              onChange={(e) =>
                setRegistrationData((prev) => ({
                  ...prev,
                  experience_level: e.target.value,
                }))
              }
              style={styles.select}
            >
              <option value="Beginner">Pemula</option>
              <option value="Intermediate">Menengah</option>
              <option value="Advanced">Mahir</option>
              <option value="Professional">Profesional</option>
            </select>
          </div>
        </form>

        <div style={styles.paymentInfo}>
          <h4 style={styles.paymentTitle}>💳 Informasi Pembayaran</h4>
          <p style={styles.paymentText}>
            Setelah mendaftar, lakukan pembayaran melalui:
          </p>
          <div style={styles.paymentMethods}>
            <div style={styles.paymentMethod}>
              <strong>GoPay:</strong> 0895340205302
            </div>
            <div style={styles.paymentMethod}>
              <strong>Konfirmasi:</strong> WhatsApp 085810526151
            </div>
          </div>
        </div>
      </div>

      <div style={styles.modalActions}>
        <button onClick={onClose} className="btn btn-secondary">
          Batal
        </button>
        <button onClick={onSubmit} className="btn btn-primary">
          Daftar & Bayar
        </button>
      </div>
    </div>
  </div>
);

const styles = {
  container: {
    paddingTop: "30px",
    paddingBottom: "40px",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "10px",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "1.1rem",
    opacity: 0.8,
  },
  tournamentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "25px",
    marginBottom: "50px",
  },
  tournamentCard: {
    padding: "25px",
    transition: "transform 0.3s ease",
  },
  cardHeader: {
    marginBottom: "20px",
  },
  cardTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "10px",
  },
  tournamentTitle: {
    fontSize: "1.3rem",
    fontWeight: "600",
    flex: 1,
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "white",
  },
  tournamentDesc: {
    opacity: 0.8,
    lineHeight: 1.5,
  },
  tournamentInfo: {
    marginBottom: "20px",
  },
  infoRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "12px",
  },
  infoIcon: {
    fontSize: "1.1rem",
    marginTop: "2px",
    minWidth: "16px",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  infoLabel: {
    fontSize: "0.85rem",
    opacity: 0.7,
    marginBottom: "2px",
  },
  infoValue: {
    fontSize: "0.95rem",
    fontWeight: "500",
  },
  prizesSection: {
    marginBottom: "20px",
  },
  prizesTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "10px",
  },
  prizesList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  prizeItem: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
  },
  prizePosition: {
    fontWeight: "600",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  prizeReward: {
    opacity: 0.9,
  },
  cardActions: {
    textAlign: "center",
  },
  registerButton: {
    width: "100%",
    padding: "12px 20px",
    fontSize: "16px",
    fontWeight: "600",
  },
  infoSection: {
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "30px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
  },
  infoCard: {
    textAlign: "center",
    padding: "25px",
  },
  infoCardIcon: {
    fontSize: "2.5rem",
    marginBottom: "15px",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  infoCardTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "15px",
  },
  infoCardList: {
    listStyle: "none",
    padding: 0,
    textAlign: "left",
  },
  infoCardItem: {
    padding: "5px 0",
    fontSize: "0.95rem",
    opacity: 0.9,
    position: "relative",
    paddingLeft: "20px",
  },
  contactSection: {
    textAlign: "center",
  },
  contactCard: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "30px",
  },
  contactTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "10px",
  },
  contactText: {
    marginBottom: "20px",
    opacity: 0.8,
  },
  contactButton: {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "600",
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
    maxWidth: "500px",
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
  tournamentSummary: {
    background: "rgba(255,255,255,0.1)",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    textAlign: "center",
  },
  registrationForm: {
    marginBottom: "20px",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "500",
    fontSize: "0.9rem",
  },
  input: {
    width: "100%",
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },
  paymentInfo: {
    background: "rgba(255,255,255,0.05)",
    padding: "15px",
    borderRadius: "10px",
  },
  paymentTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "10px",
  },
  paymentText: {
    marginBottom: "10px",
    opacity: 0.8,
  },
  paymentMethods: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  paymentMethod: {
    fontSize: "0.9rem",
  },
  modalActions: {
    display: "flex",
    gap: "15px",
    justifyContent: "flex-end",
  },
};

// Add hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .tournament-card:hover {
    transform: translateY(-5px) !important;
  }
  .info-card-item::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #4caf50;
    font-weight: bold;
  }
`;
document.head.appendChild(styleSheet);

export default TournamentPage;
