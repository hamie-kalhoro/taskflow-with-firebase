import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, Tag, ChevronDown, Check } from 'lucide-react';
import './AddTaskModal.css'; // Reusing styles
import { useTasks } from '../context/TaskContext';

const EditTaskModal = ({ isOpen, onClose, task }) => {
    const { editTask } = useTasks();
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        priority: 'Medium',
        category: ''
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                date: task.date,
                priority: task.priority,
                category: task.category
            });
        }
    }, [task]);

    if (!isOpen || !task) return null;

    const priorities = [
        { value: 'High', color: '#E74C3C' },
        { value: 'Medium', color: '#F1C40F' },
        { value: 'Low', color: '#2ECC71' }
    ];

    const categories = [
        { value: 'Work', color: '#FF8C42' },
        { value: 'Personal', color: '#8E44AD' },
        { value: 'Health', color: '#2ECC71' },
        { value: 'Shopping', color: '#1ABC9C' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        await editTask(task.id, {
            ...formData
        });

        onClose();
    };

    const selectedPriority = priorities.find(p => p.value === formData.priority);
    const selectedCategory = categories.find(c => c.value === formData.category);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Task</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Task Title <span className="required">*</span></label>
                        <input
                            type="text"
                            placeholder="What needs to be done?"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            placeholder="Add more details..."
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Due Date</label>
                            <div className="input-wrapper">
                                <Calendar size={16} className="input-icon" />
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-group half">
                            <label>Priority</label>
                            <div className="custom-select-wrapper">
                                <button
                                    type="button"
                                    className="custom-select-trigger"
                                    onClick={() => { setShowPriorityDropdown(!showPriorityDropdown); setShowCategoryDropdown(false); }}
                                >
                                    <span className="select-dot" style={{ backgroundColor: selectedPriority?.color }}></span>
                                    <span className="select-value">{formData.priority}</span>
                                    <ChevronDown size={16} className="select-arrow" />
                                </button>
                                {showPriorityDropdown && (
                                    <div className="custom-select-dropdown">
                                        {priorities.map(p => (
                                            <button
                                                key={p.value}
                                                type="button"
                                                className={`dropdown-option ${formData.priority === p.value ? 'selected' : ''}`}
                                                onClick={() => { setFormData({ ...formData, priority: p.value }); setShowPriorityDropdown(false); }}
                                            >
                                                <span className="select-dot" style={{ backgroundColor: p.color }}></span>
                                                <span>{p.value}</span>
                                                {formData.priority === p.value && <Check size={16} className="check-icon" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <div className="custom-select-wrapper">
                            <button
                                type="button"
                                className="custom-select-trigger"
                                onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowPriorityDropdown(false); }}
                            >
                                {formData.category ? (
                                    <>
                                        <span className="select-dot" style={{ backgroundColor: selectedCategory?.color }}></span>
                                        <span className="select-value">{formData.category}</span>
                                    </>
                                ) : (
                                    <span className="select-value placeholder">Select a category</span>
                                )}
                                <ChevronDown size={16} className="select-arrow" />
                            </button>
                            {showCategoryDropdown && (
                                <div className="custom-select-dropdown">
                                    {categories.map(c => (
                                        <button
                                            key={c.value}
                                            type="button"
                                            className={`dropdown-option ${formData.category === c.value ? 'selected' : ''}`}
                                            onClick={() => { setFormData({ ...formData, category: c.value }); setShowCategoryDropdown(false); }}
                                        >
                                            <span className="select-dot" style={{ backgroundColor: c.color }}></span>
                                            <span>{c.value}</span>
                                            {formData.category === c.value && <Check size={16} className="check-icon" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTaskModal;
