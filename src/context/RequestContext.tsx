import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { CampusRequest, RequestStatus, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { useToast } from './ToastContext';

interface RequestContextValue {
  requests: CampusRequest[];
  loading: boolean;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  storageMode: 'supabase' | 'localStorage';
  stats: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
  };
  createRequest: (
    data: Omit<CampusRequest, 'timeline' | 'createdAt' | 'updatedAt'>
  ) => Promise<CampusRequest>;
  updateStatus: (
    id: string,
    newStatus: RequestStatus,
    staffName?: string,
    note?: string
  ) => Promise<boolean>;
  resetToDemo: () => void;
  refreshRequests: () => Promise<void>;
}

const RequestContext = createContext<RequestContextValue | undefined>(undefined);

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<CampusRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const { showToast } = useToast();

  const storageMode = useMemo(() => storageService.getStorageMode(), []);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const data = await storageService.getAllRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
      showToast('error', 'Sync Error', 'Could not retrieve campus tickets.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const stats = useMemo(() => {
    const total = requests.length;
    const open = requests.filter((r) => r.status === 'Open').length;
    const inProgress = requests.filter((r) => r.status === 'In Progress').length;
    const resolved = requests.filter((r) => r.status === 'Resolved').length;
    return { total, open, inProgress, resolved };
  }, [requests]);

  const createRequest = async (
    data: Omit<CampusRequest, 'timeline' | 'createdAt' | 'updatedAt'>
  ): Promise<CampusRequest> => {
    try {
      const created = await storageService.createRequest(data);
      setRequests((prev) => [created, ...prev.filter((r) => r.id !== created.id)]);
      showToast('success', 'Ticket Submitted', `Request #${created.id} logged successfully.`);
      return created;
    } catch (err) {
      showToast('error', 'Submission Failed', 'An error occurred while creating your ticket.');
      throw err;
    }
  };

  const updateStatus = async (
    id: string,
    newStatus: RequestStatus,
    staffName: string = 'Campus Staff Member',
    note?: string
  ): Promise<boolean> => {
    try {
      const updated = await storageService.updateRequestStatus(id, newStatus, staffName, note);
      if (updated) {
        setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        showToast(
          'info',
          'Status Updated',
          `Ticket #${id} is now marked as "${newStatus}".`
        );
        return true;
      }
      return false;
    } catch (err) {
      showToast('error', 'Update Failed', 'Failed to update ticket status.');
      return false;
    }
  };

  const resetToDemo = () => {
    const fresh = storageService.resetDemoData();
    setRequests(fresh);
    showToast('info', 'Reset Complete', 'Default campus helpdesk tickets restored.');
  };

  return (
    <RequestContext.Provider
      value={{
        requests,
        loading,
        activeRole,
        setActiveRole,
        storageMode,
        stats,
        createRequest,
        updateStatus,
        resetToDemo,
        refreshRequests: fetchRequests,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

export const useRequests = (): RequestContextValue => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
};
