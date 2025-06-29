import React, { useState } from 'react';
import { useConfiguratorStore } from '../store';
import { useAuth } from '../../context/AuthContext';

const SaveButton = () => {
  const { currentUser } = useAuth();
  const saveUserAvatar = useConfiguratorStore(state => state.saveUserAvatar);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSave = async () => {
    if (!currentUser) {
      setSaveStatus('请先登录');
      return;
    }

    setSaving(true);
    setSaveStatus(null);

    try {
      const success = await saveUserAvatar(currentUser.id);
      if (success) {
        setSaveStatus('Success');
      } else {
        setSaveStatus('Failed...');
      }
    } catch (error) {
      console.error('保存头像失败:', error);
      setSaveStatus('保存失败');
    } finally {
      setSaving(false);
      
      // 3秒后清除状态消息
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-green-500 hover:bg-green-600 transition-colors duration-300 text-white font-medium px-4 py-3 pointer-events-auto drop-shadow-md"
      >
        {saving ? '保存中...' : 'Save！🙈'}
      </button>
      {saveStatus && (
        <div className={`mt-2 text-sm ${saveStatus === '保存成功' ? 'text-green-500' : 'text-red-500'}`}>
          {saveStatus}
        </div>
      )}
    </div>
  );
};

export default SaveButton;