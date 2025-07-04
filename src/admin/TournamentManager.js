import React, { useState } from "react";
import { tournamentService } from "../services/database";
import { v4 as uuidv4 } from "uuid";

const TournamentManager = () => {
  const [tournaments, setTournaments] = useState([
    {
      id: 1,
      title: "Weekly Challenge #8",
      description: "Kompetisi karaoke mingguan dengan tema lagu pop Indonesia",
      start_date: "2024-07-15T19:00:00Z",
      end_date: "2024-07-21T23:59:59Z",
      entry_fee: 5000,
      max_participants: 50,
      current_participants: 23,
      prize_pool: 500000,
      status: "registration_open",
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTournament, setNewTournament] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    entry_fee: 5000,
    max_participants: 50,
    prize_pool: 500000,
    rules: [""],
    prizes: [{ position: 1, prize: "" }],
  });

  const handleCreateTournament = () => {
    const tournament = {
      id: Date.now(),
      ...newTournament,
      current_participants: 0,
      status: "registration_open",
      created_at: new Date().toISOString(),
    };

    setTournaments((prev) => [tournament, ...prev]);
    setShowCreateForm(false);
    setNewTournament({
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      entry_fee: 5000,
      max_participants: 50,
      prize_pool: 500000,
      rules: [""],
      prizes: [{ position: 1, prize: "" }],
    });

    alert("Tournament berhasil dibuat!");
  };

  const addRule = () => {
    setNewTournament((prev) => ({
      ...prev,
      rules: [...prev.rules, ""],
    }));
  };

  const addPrize = () => {
    setNewTournament((prev) => ({
      ...prev,
      prizes: [...prev.prizes, { position: prev.prizes.length + 1, prize: "" }],
    }));
  };

  const updateRule = (index, value) => {
    setNewTournament((prev) => ({
      ...prev,
      rules: prev.rules.map((rule, i) => (i === index ? value : rule)),
    }));
  };

  const updatePrize = (index, field, value) => {
    setNewTournament((prev) => ({
      ...prev,
      prizes: prev.prizes.map((prize, i) =>
        i === index ? { ...prize, [field]: value } : prize,
      ),
    }));
  };

  const deleteRule = (index) => {
    setNewTournament((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const deletePrize = (index) => {
    setNewTournament((prev) => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index),
    }));
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
        <h3 style={styles.title}>🏆 Manajemen Tournament</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
          style={styles.createButton}
        >
          <i className="fas fa-plus"></i>
          Buat Tournament Baru
        </button>
      </div>

      {/* Tournament List */}
      <div style={styles.tournamentsList}>
        {tournaments.map((tournament) => (
          <TournamentCard
            key={tournament.id}
            tournament={tournament}
            formatDate={formatDate}
          />
        ))}
      </div>

      {/* Create Tournament Modal */}
      {showCreateForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal} className="card">
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Buat Tournament Baru</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                style={styles.closeButton}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nama Tournament *</label>
                  <input
                    type="text"
                    value={newTournament.title}
                    onChange={(e) =>
                      setNewTournament((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    style={styles.input}
                    placeholder="Nama tournament"
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Deskripsi *</label>
                  <textarea
                    value={newTournament.description}
                    onChange={(e) =>
                      setNewTournament((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    style={styles.textarea}
                    placeholder="Deskripsi tournament"
                    rows="3"
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Tanggal Mulai *</label>
                  <input
                    type="datetime-local"
                    value={newTournament.start_date}
                    onChange={(e) =>
                      setNewTournament((prev) => ({
                        ...prev,
                        start_date: e.target.value,
                      }))
                    }
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Tanggal Selesai *</label>
                  <input
                    type="datetime-local"
                    value={newTournament.end_date}
                    onChange={(e) =>
                      setNewTournament((prev) => ({
                        ...prev,
                        end_date: e.target.value,
                      }))
                    }
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Biaya Pendaftaran (IDR)</label>
                  <input
                    type="number"
                    value={newTournament.entry_fee}
                    onChange={(e) =>
                      setNewTournament((prev) => ({
                        ...prev,
                        entry_fee: parseInt(e.target.value),
                      }))
                    }
                    style={styles.input}
                    min="0"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Maksimal Peserta</label>
                  <input
                    type="number"
                    value={newTournament.max_participants}
                    onChange={(e) =>
                      setNewTournament((prev) => ({
                        ...prev,
                        max_participants: parseInt(e.target.value),
                      }))
                    }
                    style={styles.input}
                    min="1"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Total Hadiah (IDR)</label>
                  <input
                    type="number"
                    value={newTournament.prize_pool}
                    onChange={(e) =>
                      setNewTournament((prev) => ({
                        ...prev,
                        prize_pool: parseInt(e.target.value),
                      }))
                    }
                    style={styles.input}
                    min="0"
                  />
                </div>
              </div>

              {/* Rules Section */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <h4 style={styles.sectionTitle}>Aturan Tournament</h4>
                  <button
                    onClick={addRule}
                    className="btn btn-secondary"
                    style={styles.addButton}
                  >
                    <i className="fas fa-plus"></i>
                    Tambah Aturan
                  </button>
                </div>

                {newTournament.rules.map((rule, index) => (
                  <div key={index} style={styles.ruleItem}>
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => updateRule(index, e.target.value)}
                      style={styles.ruleInput}
                      placeholder={`Aturan ${index + 1}`}
                    />
                    {newTournament.rules.length > 1 && (
                      <button
                        onClick={() => deleteRule(index)}
                        style={styles.deleteButton}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Prizes Section */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <h4 style={styles.sectionTitle}>Hadiah</h4>
                  <button
                    onClick={addPrize}
                    className="btn btn-secondary"
                    style={styles.addButton}
                  >
                    <i className="fas fa-plus"></i>
                    Tambah Hadiah
                  </button>
                </div>

                {newTournament.prizes.map((prize, index) => (
                  <div key={index} style={styles.prizeItem}>
                    <input
                      type="number"
                      value={prize.position}
                      onChange={(e) =>
                        updatePrize(index, "position", parseInt(e.target.value))
                      }
                      style={styles.positionInput}
                      placeholder="Posisi"
                      min="1"
                    />
                    <input
                      type="text"
                      value={prize.prize}
                      onChange={(e) =>
                        updatePrize(index, "prize", e.target.value)
                      }
                      style={styles.prizeInput}
                      placeholder="Hadiah (contoh: Rp 500.000 + Trophy)"
                    />
                    {newTournament.prizes.length > 1 && (
                      <button
                        onClick={() => deletePrize(index)}
                        style={styles.deleteButton}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.modalActions}>
              <button
                onClick={() => setShowCreateForm(false)}
                className="btn btn-secondary"
              >
                Batal
              </button>
              <button
                onClick={handleCreateTournament}
                className="btn btn-primary"
              >
                Buat Tournament
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TournamentCard = ({ tournament, formatDate }) => (
  <div className="card" style={styles.tournamentCard}>
    <div style={styles.cardHeader}>
      <div>
        <h4 style={styles.tournamentTitle}>{tournament.title}</h4>
        <p style={styles.tournamentDesc}>{tournament.description}</p>
      </div>
      <span style={styles.statusBadge}>
        {tournament.status === "registration_open" ? "Buka" : "Tutup"}
      </span>
    </div>

    <div style={styles.tournamentInfo}>
      <div style={styles.infoItem}>
        <i className="fas fa-calendar"></i>
        <span>
          {formatDate(tournament.start_date)} -{" "}
          {formatDate(tournament.end_date)}
        </span>
      </div>
      <div style={styles.infoItem}>
        <i className="fas fa-users"></i>
        <span>
          {tournament.current_participants} / {tournament.max_participants}{" "}
          peserta
        </span>
      </div>
      <div style={styles.infoItem}>
        <i className="fas fa-money-bill-wave"></i>
        <span>
          Rp {tournament.entry_fee.toLocaleString()} • Pool: Rp{" "}
          {tournament.prize_pool.toLocaleString()}
        </span>
      </div>
    </div>

    <div style={styles.cardActions}>
      <button className="btn btn-secondary" style={styles.actionButton}>
        <i className="fas fa-users"></i>
        Kelola Peserta
      </button>
      <button className="btn btn-primary" style={styles.actionButton}>
        <i className="fas fa-edit"></i>
        Edit Tournament
      </button>
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
  createButton: {
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  tournamentsList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  tournamentCard: {
    padding: "25px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  tournamentTitle: {
    fontSize: "1.3rem",
    fontWeight: "600",
    marginBottom: "8px",
  },
  tournamentDesc: {
    opacity: 0.8,
    lineHeight: 1.5,
  },
  statusBadge: {
    background: "#4caf50",
    color: "white",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "600",
  },
  tournamentInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "0.9rem",
    opacity: 0.9,
  },
  cardActions: {
    display: "flex",
    gap: "10px",
  },
  actionButton: {
    padding: "8px 16px",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
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
    maxWidth: "700px",
    width: "100%",
    maxHeight: "90vh",
    overflow: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
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
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontWeight: "500",
    fontSize: "0.9rem",
  },
  input: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },
  textarea: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  section: {
    marginBottom: "25px",
    padding: "20px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "10px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    margin: 0,
  },
  addButton: {
    padding: "6px 12px",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  ruleItem: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "10px",
  },
  ruleInput: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },
  prizeItem: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "10px",
  },
  positionInput: {
    width: "80px",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },
  prizeInput: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },
  deleteButton: {
    background: "rgba(244, 67, 54, 0.2)",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    color: "#f44336",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalActions: {
    display: "flex",
    gap: "15px",
    justifyContent: "flex-end",
  },
};

export default TournamentManager;
