import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { config } from '@/config/environment';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLogin from '@/components/AdminLogin';
import RoomEditDialog from '@/components/RoomEditDialog';
import ConferenceRoomEditDialog from '@/components/ConferenceRoomEditDialog';
import AdminHeader from '@/components/AdminHeader';
import RoomList from '@/components/RoomList';
import ConferenceRoomList from '@/components/ConferenceRoomList';
import LodgingBookings from '@/components/LodgingBookings';
import ConferenceBookings from '@/components/ConferenceBookings';
import ContactMessages from '@/components/ContactMessages';

const Admin = () => {
  // No longer using newRoom state, handled by RoomEditDialog
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingConferenceRoom, setEditingConferenceRoom] = useState<any>(null);
  const [showConferenceEditDialog, setShowConferenceEditDialog] = useState(false);
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);
  // const [uploading, setUploading] = useState(false); // Unused
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { admin, loading, logout, isAuthenticated, login } = useAdminAuth();
  const [justLoggedIn, setJustLoggedIn] = useState(false);


  // Custom login handler to trigger re-render after login
  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      setJustLoggedIn(true);
    }
    return result;
  };

  // Fetch rooms with images
  const { data: roomsRaw, isLoading: roomsLoading } = useQuery({
    queryKey: ['admin-rooms'],
    queryFn: async () => {
      const res = await api.get(`${config.backend.url}/lodgings`);
      return res.data;
    },
    enabled: isAuthenticated
  });
  const rooms = Array.isArray(roomsRaw) ? roomsRaw : [];

  // Fetch conference rooms with images
  const { data: conferenceRoomsRaw, isLoading: conferenceRoomsLoading } = useQuery({
    queryKey: ['admin-conference-rooms'],
    queryFn: async () => {
      const res = await api.get(`${config.backend.url}/conferences`);
      return res.data;
    },
    enabled: isAuthenticated
  });
  const conferenceRooms = Array.isArray(conferenceRoomsRaw) ? conferenceRoomsRaw : [];

  // Fetch bookings with room details
  // Fetch lodging bookings
const { data: lodgingBookingsRaw } = useQuery({
  queryKey: ['admin-lodging-bookings'],
  queryFn: async () => {
    const res = await api.get(`${config.backend.url}/lodging-bookings`);
    return res.data;
  },
  enabled: isAuthenticated
});
const lodgingBookings = Array.isArray(lodgingBookingsRaw) ? lodgingBookingsRaw : [];

// Fetch conference bookings
const { data: conferenceBookingsRaw } = useQuery({
  queryKey: ['admin-conference-bookings'],
  queryFn: async () => {
    const res = await api.get(`${config.backend.url}/conference-bookings`);
    return res.data;
  },
  enabled: isAuthenticated
});
const conferenceBookings = Array.isArray(conferenceBookingsRaw) ? conferenceBookingsRaw : [];





  // Room CRUD operations
  const createRoomMutation = useMutation({
    mutationFn: async ({ roomData }: { roomData: any }) => {
      const res = await api.post(`${config.backend.url}/lodgings`, roomData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({ title: "Room created successfully" });
      // Room creation handled by RoomEditDialog, no need to reset legacy newRoom state
    },
    onError: (error: any) => {
      toast({
        title: "Error creating room",
        description: error?.message || "Failed to add room. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateRoomMutation = useMutation({
    mutationFn: async ({ roomData }: { roomData: any }) => {
      const res = await api.put(`${config.backend.url}/lodgings/${roomData.id}`, roomData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({ title: "Room updated successfully" });
      setEditingRoom(null);
      setShowEditDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error updating room",
        description: error?.message || 'An error occurred',
        variant: "destructive"
      });
    }
  });



  // Delete room mutation
  const deleteRoomMutation = useMutation({
    mutationFn: async (roomId: string) => {
      await api.delete(`${config.backend.url}/lodgings/${roomId}`);
      return roomId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setDeletingRoomId(null);
      toast({
        title: "Success",
        description: "Room deleted successfully!",
      });
    },
    onError: (error: any) => {
      setDeletingRoomId(null);
      toast({
        title: "Error",
        description: error.message || "Failed to delete room. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Conference Room CRUD operations
  const createConferenceRoomMutation = useMutation({
    mutationFn: async ({ roomData }: { roomData: any }) => {
      const res = await api.post(`${config.backend.url}/conferences`, roomData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-conference-rooms'] });
      toast({ title: "Conference room created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error creating conference room", description: error.message, variant: "destructive" });
    }
  });

  const updateConferenceRoomMutation = useMutation({
    mutationFn: async ({ roomData }: { roomData: any }) => {
      const res = await api.put(`${config.backend.url}/conferences/${roomData.id}`, roomData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-conference-rooms'] });
      toast({ title: "Conference room updated successfully" });
      setEditingConferenceRoom(null);
      setShowConferenceEditDialog(false);
    },
    onError: (error: any) => {
      toast({ title: "Error updating conference room", description: error.message, variant: "destructive" });
    }
  });

  const deleteConferenceRoomMutation = useMutation({
    mutationFn: async (roomId: string) => {
      await api.delete(`${config.backend.url}/conferences/${roomId}`);
      return roomId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-conference-rooms'] });
      toast({ title: "Conference room deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting conference room", description: error.message, variant: "destructive" });
    }
  });

  // Only pass roomData, not images, to mutations
  const handleCreateRoom = (roomData: any) => {
    // Ensure all required fields are present and valid
    const payload = {
      id: roomData.id || undefined,
      name: roomData.name,
      type: roomData.type,
      occupancy: roomData.occupancy,
      price: roomData.price,
      amenities: roomData.amenities,
      image_urls: roomData.image_urls,
      description: roomData.description,
      created_at: roomData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    createRoomMutation.mutate({ roomData: payload });
  };

  const handleUpdateRoom = (roomData: any) => {
    const payload = {
      ...roomData,
      updated_at: new Date().toISOString(),
    };
    updateRoomMutation.mutate({ roomData: payload });
  };

  const handleCreateConferenceRoom = (roomData: any) => {
    // Only send fields expected by backend and ensure all required fields are present
    const payload = {
      id: roomData.id || undefined,
      name: roomData.name,
      price: roomData.price,
      size: roomData.size,
      max_users: roomData.max_users,
      amenities: roomData.amenities,
      image_urls: roomData.image_urls,
      description: roomData.description,
      created_at: roomData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    createConferenceRoomMutation.mutate({ roomData: payload });
  };

  const handleUpdateConferenceRoom = (roomData: any) => {
    updateConferenceRoomMutation.mutate({ roomData });
  };

  const handleEditRoom = (room: any) => {
    setEditingRoom(room);
    setShowEditDialog(true);
  };

  const handleEditConferenceRoom = (room: any) => {
    setEditingConferenceRoom(room);
    setShowConferenceEditDialog(true);
  };

  // Removed unused handleAddRoom and addRoomMutation

  const handleDeleteRoom = (roomId: string) => {
    if (deletingRoomId === roomId) {
      deleteRoomMutation.mutate(roomId);
    } else {
      setDeletingRoomId(roomId);
      setTimeout(() => {
        setDeletingRoomId(null);
      }, 3000);
    }
  };
  
  const handleDeleteConferenceRoom = (roomId: string) => {
    if (deletingRoomId === roomId) {
      deleteConferenceRoomMutation.mutate(roomId);
    } else {
      setDeletingRoomId(roomId);
      setTimeout(() => {
        setDeletingRoomId(null);
      }, 3000);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel-navy mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !justLoggedIn) {
    return <AdminLogin login={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader admin={admin} onLogout={logout} />
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="lodging-bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="lodging-bookings">Lodging Bookings</TabsTrigger>
            <TabsTrigger value="conference-bookings">Conference Bookings</TabsTrigger>
            <TabsTrigger value="rooms">Room Management</TabsTrigger>
            <TabsTrigger value="conference">Conference Rooms</TabsTrigger>
            <TabsTrigger value="contact-messages">Contact Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="lodging-bookings">
            <LodgingBookings bookings={lodgingBookings} />
          </TabsContent>

          <TabsContent value="conference-bookings">
            <ConferenceBookings bookings={conferenceBookings} />
          </TabsContent>

          <TabsContent value="rooms">
            <RoomList
              rooms={rooms || []}
              loading={roomsLoading}
              onEdit={handleEditRoom}
              onDelete={handleDeleteRoom}
              onAdd={() => { setEditingRoom(null); setShowEditDialog(true); }}
              deletingRoomId={deletingRoomId}
              deleteRoomPending={deleteRoomMutation.isPending}
            />
          </TabsContent>

          <TabsContent value="conference">
            <ConferenceRoomList
              conferenceRooms={conferenceRooms || []}
              loading={conferenceRoomsLoading}
              onEdit={handleEditConferenceRoom}
              onDelete={handleDeleteConferenceRoom}
              onAdd={() => { setEditingConferenceRoom(null); setShowConferenceEditDialog(true); }}
              deletingRoomId={deletingRoomId}
              deleteRoomPending={deleteConferenceRoomMutation.isPending}
            />
          </TabsContent>

          <TabsContent value="contact-messages">
            <ContactMessages />
          </TabsContent>
        </Tabs>
      </div>

      {showEditDialog && (
        <RoomEditDialog
          room={editingRoom}
          onClose={() => {
            setShowEditDialog(false);
            setEditingRoom(null);
          }}
          onSave={editingRoom ? handleUpdateRoom : handleCreateRoom}
        />
      )}

      {showConferenceEditDialog && (
        <ConferenceRoomEditDialog
          room={editingConferenceRoom}
          onClose={() => {
            setShowConferenceEditDialog(false);
            setEditingConferenceRoom(null);
          }}
          onSave={editingConferenceRoom ? handleUpdateConferenceRoom : handleCreateConferenceRoom}
        />
      )}
    </div>
  );
};

export default Admin;