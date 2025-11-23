import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

interface AccountActionFormProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'password' | 'edit' | 'delete' | null;
  user: any;
  username: string;
  userType: 'customer' | 'barista' | 'manager' | 'student';
  onSuccess?: () => void;
}

const AccountActionForm: React.FC<AccountActionFormProps> = ({
  isOpen,
  onClose,
  action,
  user,
  username,
  userType,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  //password form fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  //edit info form fields
  const [editForm, setEditForm] = useState({
    name: '',
    phone_number: '',
    student_id: '',
    employee_id: '',
    store_id: '',
    salary: '',
    is_manager: false,
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        phone_number: user.phone_number?.toString() || '',
        student_id: user.student_id?.toString() || '',
        employee_id: user.employee_id?.toString() || '',
        store_id: user.store_id?.toString() || '',
        salary: user.salary?.toString() || '',
        is_manager: user.is_manager || false,
      });
    }
  }, [user]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.patch(`/api/coffee-shop/users/${username}/`, {
        newPassword,
      });
      alert('Password updated successfully!');
      setNewPassword('');
      setOldPassword('');
      setConfirmPassword('');
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert('Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(`/api/coffee-shop/users/${username}/type/`, {
        newInfo: editForm,
      });
      alert('Information updated successfully!');
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert('Failed to update information.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `/api/coffee-shop/users/${username}/`
      );
      console.log('Response:', response.data);
      alert('Account deleted.');
      onClose();
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      alert('Failed to delete account.\n', err);
    } finally {
      setLoading(false);
    }
  };
  const titleMap = {
    password: 'Change Password',
    edit: 'Edit Information',
    delete: 'Delete Account',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={titleMap[action || 'edit']}>
      {action === 'password' ? (
        <form onSubmit={handlePasswordSubmit} className='modal-form'>
          <label>
            Old Password:
            <input
              type='password'
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </label>
          <label>
            New Password:
            <input
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Confirm Password:
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          <button type='submit' disabled={loading}>
            {loading ? 'Saving...' : 'Change Password'}
          </button>
        </form>
      ) : action === 'delete' ? (
        <div className='modal-form'>
          <p>
            Are you sure you want to delete your account? This cannot be undone.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              style={{
                backgroundColor: 'red',
                color: 'white',
                marginRight: '1rem',
              }}
            >
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleEditSubmit} className='modal-form'>
          <label>
            Name:
            <input
              type='text'
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />
          </label>

          {userType === 'customer' || userType === 'student' ? (
            <>
              <label>
                Phone Number:
                <input
                  type='text'
                  value={editForm.phone_number}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone_number: e.target.value })
                  }
                />
              </label>
              {userType === 'student' && (
                <label>
                  Student ID:
                  <input
                    type='text'
                    value={editForm.student_id}
                    onChange={(e) =>
                      setEditForm({ ...editForm, student_id: e.target.value })
                    }
                  />
                </label>
              )}
            </>
          ) : (
            <>
              <label>
                Employee ID:
                <input
                  type='text'
                  value={editForm.employee_id}
                  onChange={(e) =>
                    setEditForm({ ...editForm, employee_id: e.target.value })
                  }
                />
              </label>
              <label>
                Store ID:
                <input
                  type='text'
                  value={editForm.store_id}
                  onChange={(e) =>
                    setEditForm({ ...editForm, store_id: e.target.value })
                  }
                />
              </label>
              <label>
                Salary:
                <input
                  type='number'
                  value={editForm.salary}
                  onChange={(e) =>
                    setEditForm({ ...editForm, salary: e.target.value })
                  }
                />
              </label>
              <label>
                Is Manager:
                <input
                  type='checkbox'
                  checked={editForm.is_manager}
                  onChange={(e) =>
                    setEditForm({ ...editForm, is_manager: e.target.checked })
                  }
                />
              </label>
            </>
          )}

          <button type='submit' disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}
    </Modal>
  );
};

export default AccountActionForm;
