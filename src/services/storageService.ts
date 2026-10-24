import { CampusRequest, RequestStatus } from '../types';
import { INITIAL_SEEDS } from './seedData';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const STORAGE_KEY = 'campuspulse_requests_v1';

// Initialize and retrieve local data with safety check
function loadLocalData(): CampusRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDS));
      return INITIAL_SEEDS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDS));
      return INITIAL_SEEDS;
    }
    return parsed;
  } catch (error) {
    console.warn('Error reading from localStorage, using seeds:', error);
    return INITIAL_SEEDS;
  }
}

function saveLocalData(requests: CampusRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export const storageService = {
  getStorageMode(): 'supabase' | 'localStorage' {
    return isSupabaseConfigured() ? 'supabase' : 'localStorage';
  },

  async getAllRequests(): Promise<CampusRequest[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Supabase fetch failed, falling back to localStorage:', error.message);
          return loadLocalData();
        }

        if (data && data.length > 0) {
          return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            category: item.category,
            location: item.location,
            contactName: item.contact_name,
            contactInfo: item.contact_info,
            priority: item.priority || 'Medium',
            status: item.status,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            timeline: item.timeline || [],
            staffNotes: item.staff_notes,
            assignedStaff: item.assigned_staff,
          }));
        }
      } catch (err) {
        console.warn('Supabase query error, fallback to localStorage', err);
      }
    }

    return loadLocalData();
  },

  async getRequestById(id: string): Promise<CampusRequest | null> {
    const all = await this.getAllRequests();
    return all.find((r) => r.id.toLowerCase() === id.toLowerCase()) || null;
  },

  async createRequest(
    newRequest: Omit<CampusRequest, 'timeline' | 'createdAt' | 'updatedAt'>
  ): Promise<CampusRequest> {
    const now = new Date().toISOString();
    const fullRequest: CampusRequest = {
      ...newRequest,
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          status: newRequest.status,
          timestamp: now,
          updatedBy: `${newRequest.contactName} (Student)`,
          note: 'Ticket created and submitted for campus review.',
        },
      ],
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('requests').insert([
          {
            id: fullRequest.id,
            title: fullRequest.title,
            description: fullRequest.description,
            category: fullRequest.category,
            location: fullRequest.location,
            contact_name: fullRequest.contactName,
            contact_info: fullRequest.contactInfo,
            priority: fullRequest.priority,
            status: fullRequest.status,
            created_at: fullRequest.createdAt,
            updated_at: fullRequest.updatedAt,
            timeline: fullRequest.timeline,
          },
        ]);

        if (error) {
          console.warn('Supabase insert failed, storing in localStorage:', error.message);
        }
      } catch (err) {
        console.warn('Supabase insert exception:', err);
      }
    }

    // Always update local cache so instant UI reactivity is preserved
    const local = loadLocalData();
    const updated = [fullRequest, ...local.filter((r) => r.id !== fullRequest.id)];
    saveLocalData(updated);

    return fullRequest;
  },

  async updateRequestStatus(
    id: string,
    newStatus: RequestStatus,
    staffName: string = 'Campus Staff Member',
    note?: string
  ): Promise<CampusRequest | null> {
    const now = new Date().toISOString();
    const local = loadLocalData();
    const index = local.findIndex((r) => r.id.toLowerCase() === id.toLowerCase());

    if (index === -1) return null;

    const current = local[index];
    const newTimelineEntry = {
      id: `tl-${Date.now()}`,
      status: newStatus,
      timestamp: now,
      updatedBy: staffName,
      note: note?.trim() || `Status changed from ${current.status} to ${newStatus}.`,
    };

    const updatedRequest: CampusRequest = {
      ...current,
      status: newStatus,
      updatedAt: now,
      timeline: [...current.timeline, newTimelineEntry],
      staffNotes: note?.trim() ? note.trim() : current.staffNotes,
      assignedStaff: current.assignedStaff || staffName,
    };

    local[index] = updatedRequest;
    saveLocalData(local);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('requests')
          .update({
            status: newStatus,
            updated_at: now,
            timeline: updatedRequest.timeline,
            staff_notes: updatedRequest.staffNotes,
            assigned_staff: updatedRequest.assignedStaff,
          })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase status update error:', err);
      }
    }

    return updatedRequest;
  },

  resetDemoData(): CampusRequest[] {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDS));
      return INITIAL_SEEDS;
    } catch {
      return INITIAL_SEEDS;
    }
  },
};
