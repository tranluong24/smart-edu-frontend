

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; 
import { fetchClassDetails, fetchClassMembers } from "../api/apiService";

import "./ClassDetailPage.css"; 
import { FiCopy, FiCheck, FiAlertTriangle } from "react-icons/fi";

const ClassDetailPage = () => {
  const { classId } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [copyStatus, setCopyStatus] = useState("Copy");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const [detailsRes, membersRes] = await Promise.all([
          fetchClassDetails(classId),
          fetchClassMembers(classId),
        ]);
        setClassInfo(detailsRes.data);
        setMembers(membersRes.data);
      } catch (err) {
        console.error(`Failed to load class ${classId} data:`, err);
        if (
          err.response &&
          (err.response.status === 404 || err.response.status === 403)
        ) {
          setError(
            err.response.data.message || "Class not found or access denied."
          );
        } else {
          setError("Failed to load class details. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [classId]);

  const handleCopyCode = async () => {
    if (!classInfo?.joinCode || !navigator.clipboard) {
      setCopyStatus("Error"); 
      setTimeout(() => setCopyStatus("Copy"), 2200); 
      return;
    }

    try {
      await navigator.clipboard.writeText(classInfo.joinCode);
      setCopyStatus("Copied!"); 
      setTimeout(() => setCopyStatus("Copy"), 2200); 
    } catch (err) {
      console.error("Failed to copy join code: ", err);
      setCopyStatus("Error"); 
      setTimeout(() => setCopyStatus("Copy"), 2000);
    }
  };

  if (loading)
    return <div className="loading-message">Loading class details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!classInfo)
    return <div className="error-message">Class data not available.</div>;

  return (
    <div className="class-detail-page">
      <section className="class-header">
        <div className="class-header-main-info">
          <h1>{classInfo.title}</h1>
          <p className="class-description">
            {classInfo.description || "No description available."}
          </p>
        </div>
        {classInfo.isTeacher && classInfo.joinCode && (
          <div className="join-code-container">
            <p className="join-code-display">
              Join Code: <strong>{classInfo.joinCode}</strong>
            </p>
            <button
              type="button"
              onClick={handleCopyCode}
              
              className={`icon-button copy-icon-button ${
                // Đổi tên class 1 chút
                copyStatus === "Copied!"
                  ? "copied"
                  : copyStatus === "Error"
                  ? "error"
                  : ""
              }`}
              disabled={copyStatus !== "Copy"}
              
              aria-label={
                copyStatus === "Copy"
                  ? "Copy join code"
                  : copyStatus === "Copied!"
                  ? "Code copied!"
                  : "Copy error"
              }
              
              title={
                copyStatus === "Copy"
                  ? "Copy join code"
                  : copyStatus === "Copied!"
                  ? "Code copied!"
                  : "Error copying code"
              }
            >
              {}
              {copyStatus === "Copy" && <FiCopy />}
              {copyStatus === "Copied!" && <FiCheck />}
              {copyStatus === "Error" && <FiAlertTriangle />}
            </button>
            {}
          </div>
        )}
      </section>

      {}
      <section className="members-section">
        {}
        <div className="section-header-actions">
          <h2>Class Members ({members.length})</h2>
          {}
          <Link
            to={`/classes/${classId}/progress`} 
            className="button button-secondary button-small see-progress-button" 
          >
            See Progress
          </Link>
        </div>
        {}

        {members && members.length > 0 ? (
          <ul className="members-list enhanced-list">
            {members.map((member) => (
              <li key={member.id} className="member-item-enhanced">
                <div className="member-info-container">
                  <div className="member-avatar-placeholder">
                    {(member.username || member.email)[0].toUpperCase()}
                  </div>
                  <div className="member-details">
                    <span className="member-name">
                      {member.username || member.email.split("@")[0]}
                    </span>
                    <span className="member-email">{member.email}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-items-message">
            There are no students in this class yet.
          </p>
        )}
      </section>
    </div>
  );
};

export default ClassDetailPage;
