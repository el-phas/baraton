import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';

interface ConferenceRoomListProps {
  conferenceRooms: any[];
  loading: boolean;
  onEdit: (room: any) => void;
  onDelete: (roomId: string) => void;
  onAdd: () => void;
  deletingRoomId: string | null;
  deleteRoomPending: boolean;
}

const ConferenceRoomList: React.FC<ConferenceRoomListProps> = ({ conferenceRooms, loading, onEdit, onDelete, onAdd, deletingRoomId, deleteRoomPending }) => {
  const [modalImage, setModalImage] = useState<string | null>(null);
  return (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">Conference Room Management</h3>
      <Button onClick={onAdd} className="flex items-center gap-2">
        <Plus className="h-4 w-4" /> Add Conference Room
      </Button>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Conference Rooms</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto">
        {loading ? (
          <div className="text-center py-4">Loading conference rooms...</div>
        ) : conferenceRooms && conferenceRooms.length > 0 ? (
          <div className="space-y-4">
            {conferenceRooms.map((room) => (
              <div key={room.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium">{room.name}</h3>
                    <p className="text-sm text-gray-600">
                      {room.type} • Ksh {room.price ? room.price.toLocaleString() : 0}/hour
                    </p>
                    {/* No occupancy for conference rooms */}
                    {room.image_urls && room.image_urls.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {room.image_urls.map((url: string, idx: number) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`Conference room image ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded border cursor-pointer"
                            onClick={() => setModalImage(url)}
                          />
                        ))}
      {/* Modal for image viewing */}
      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setModalImage(null)}>
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl w-full flex flex-col items-center relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-600 hover:text-black" onClick={() => setModalImage(null)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img src={modalImage} alt="Conference room" className="max-h-[70vh] w-auto rounded" />
          </div>
        </div>
      )}
                        <p className="text-xs text-blue-600 w-full">
                          {room.image_urls.length} image{room.image_urls.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                    <div className="text-xs mt-2 text-gray-400">
                      Amenities: {room.amenities && room.amenities.length > 0 ? room.amenities.join(', ') : 'None'}
                    </div>
                    <div className="text-xs mt-1 text-gray-400">
                      {room.description}
                    </div>
                    <div className="text-xs mt-1 text-gray-400">
                      Created: {room.created_at && new Date(room.created_at).toLocaleString()}<br />
                      Updated: {room.updated_at && new Date(room.updated_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(room)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(room.id)}
                      disabled={deleteRoomPending}
                    >
                      {deletingRoomId === room.id ? (
                        "Click again to confirm"
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No conference rooms found. Add your first conference room to get started.
          </div>
        )}
      </CardContent>
    </Card>
  </div>
  );
};

export default ConferenceRoomList;
