import React, { useState, useEffect } from 'react';
import { fetchMyClasses, createClass, joinClass } from '../api/apiService'; 
import { useAuth } from '../hooks/useAuth'; 
import { Link, useNavigate } from 'react-router-dom';
import './MyClassesPage.css'; 

const MyClassesPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [myClasses, setMyClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newClassTitle, setNewClassTitle] = useState('');
    const [newClassDesc, setNewClassDesc] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    // --- Helper để cắt ngắn text ---
    const truncateText = (text, length) => {
        if (!text) return '';
        return text.length > length ? text.substring(0, length) + '...' : text;
    };

    // --- Load danh sách lớp học ---
    const loadMyClasses = async () => {
        setError('');
        try {
            const response = await fetchMyClasses();
            setMyClasses(response.data);
        } catch (err) {
            console.error("Failed to fetch my classes:", err);
            // Chỉ set lỗi nếu chưa có lớp nào được hiển thị
            if (myClasses.length === 0) {
                setError('Failed to load classes. Please check your connection or login again.');
            } else {
                // Nếu đã có lớp, có thể hiển thị lỗi nhỏ hơn hoặc log
                console.error("Error refreshing classes list.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        loadMyClasses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Chỉ chạy khi mount

    // --- Xử lý Form Tạo Lớp ---
    const handleCreateClass = async (e) => {
        e.preventDefault();
        if (!newClassTitle) {
            setFormError('Class title is required.'); return;
        }
        setFormLoading(true); setFormError(''); setFormSuccess('');
        try {
            const response = await createClass({ title: newClassTitle, description: newClassDesc });
            setFormSuccess(`Class "${newClassTitle}" created! Join Code: ${response.data.joinCode}`);
            setNewClassTitle(''); setNewClassDesc(''); setShowCreateForm(false);
            await loadMyClasses(); // Tải lại danh sách
        } catch (err) {
            console.error("Create class error:", err);
            setFormError(err.response?.data?.message || 'Failed to create class.');
        } finally {
            setFormLoading(false);
        }
    };

    // --- Xử lý Form Join Lớp ---
    const handleJoinClass = async (e) => {
        e.preventDefault();
        if (!joinCode) {
            setFormError('Join code is required.'); return;
        }
        setFormLoading(true); setFormError(''); setFormSuccess('');
        try {
            // Đảm bảo gửi đúng định dạng object mà backend mong đợi
            await joinClass({ joinCode: joinCode }); // Gửi { joinCode: 'value' }
            setFormSuccess(`Successfully joined class with code ${joinCode}!`);
            setJoinCode('');
            await loadMyClasses(); // Tải lại danh sách
        } catch (err) {
            console.error("Join class error:", err);
            setFormError(err.response?.data?.message || 'Failed to join class. Check the code and try again.');
        } finally {
            setFormLoading(false);
        }
    };

    // --- Điều hướng khi click nút View Class ---
    const navigateToClass = (e, classId) => {
        e.preventDefault(); // Ngăn Link cha hoạt động
        navigate(`/classes/${classId}`);
    };

    // --- Phần Render ---

    // Hiển thị loading ban đầu
    if (loading && myClasses.length === 0) return <div className="loading-message">Loading your classes...</div>;
    // Hiển thị lỗi ban đầu nếu không load được gì
    if (error && myClasses.length === 0) return <div className="error-message list-error">{error}</div>;

    return (
        <div className="my-classes-page">

            {/* --- Header Trang: Title + Nút Create --- */}
            <div className="page-header-actions codecombat-style-header">
                <h1 className="page-main-title">My Class</h1>
                {user?.role === 'teacher' && (
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        
                        className="toggle-form-button header-create-button green-button"
                    >
                        {showCreateForm ? 'Hide Form' : '+ Create New Class'}
                    </button>
                )}
            </div>

            {}
            {user?.role === 'teacher' && showCreateForm && (
                 <div className="create-form-container">
                    <form onSubmit={handleCreateClass} className="class-form create-class-form">
                        {}
                        <div className="form-group">
                            <label htmlFor="class-title">Class Title *</label>
                            <input type="text" id="class-title" value={newClassTitle} onChange={(e) => setNewClassTitle(e.target.value)} required disabled={formLoading}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="class-desc">Description (Optional)</label>
                            <textarea id="class-desc" value={newClassDesc} onChange={(e) => setNewClassDesc(e.target.value)} rows="3" disabled={formLoading}/>
                        </div>
                        {}
                        {formError && !formSuccess && <p className="form-inline-error">{formError}</p>}
                         {}
                        <button type="submit" className="green-button" disabled={formLoading}>
                            {formLoading ? 'Creating...' : 'Create Class'}
                        </button>
                    </form>
                </div>
            )}

            {}
            {user?.role === 'student' && (
                 <div className="join-form-container">
                    <form onSubmit={handleJoinClass} className="class-form join-form">
                        <h3>Join a Class</h3>
                        <div className="form-group">
                            <label htmlFor="join-code">Enter Join Code *</label>
                            <input type="text" id="join-code" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="e.g., AB12CD" required maxLength={8} disabled={formLoading} autoCapitalize="characters"/>
                        </div>
                         {}
                         {formError && !formSuccess && <p className="form-inline-error">{formError}</p>}
                         {}
                        <button type="submit" disabled={formLoading}>
                            {formLoading ? 'Joining...' : 'Join Class'}
                        </button>
                    </form>
                </div>
            )}

            {}
             {formSuccess && <div className="form-success-message">{formSuccess}</div>}

            {}
            {}
            {}

            {}
             {loading && myClasses.length > 0 && <div className="loading-inline">Refreshing list...</div>}

            {myClasses.length > 0 ? (
                <div className="classes-list-container">
                    {myClasses.map(cls => (
                        
                        <Link key={cls.id} to={`/classes/${cls.id}`} className="class-list-item-link">
                            {}
                            <div className="class-list-item">
                                {}
                                <div className="class-list-item-thumbnail">
                                    <img src={cls.thumbnailUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK0YLYb3BjkVflKX7QydAyCOAesXv8yD1doA&s"} alt={`${cls.title} thumbnail`} />
                                </div>
                                {}
                                <div className="class-list-item-content">
                                    <h3 className="class-list-item-title">{cls.title}</h3>
                                    <p className="class-list-item-description">
                                        {}
                                        {truncateText(cls.description, 150)}
                                    </p>
                                    {}
                                    {user?.role === 'teacher' && cls.join_code && (
                                        <p className="class-list-item-code">
                                            <strong>CodeCombat</strong>
                                        </p>
                                    )}
                                </div>
                                {}
                                <div className="class-list-item-actions">
                                    <button
                                        className="class-list-item-button" 
                                        onClick={(e) => navigateToClass(e, cls.id)}
                                    >
                                        View Class
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                
                !loading && !error && (
                    <p className="no-classes-message">
                        {user?.role === 'teacher' ? "You haven't created any classes yet. Click '+ Create New Class' above to start." : "You haven't joined any classes yet. Use the form above to join with a code."}
                    </p>
                )
            )}
            {}
            {error && myClasses.length > 0 && <div className="error-message list-error">{error}</div>}

        </div>
    );
};

export default MyClassesPage;