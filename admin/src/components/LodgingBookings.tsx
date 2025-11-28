import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BookingListProps {
  bookings: any[];
}

const LodgingBookings: React.FC<BookingListProps> = ({ bookings }) => {
  const [exportFrom, setExportFrom] = useState<string>('');
  const [exportTo, setExportTo] = useState<string>('');

  const handleExport = () => {
    // Filter bookings by export range
    const fromDate = exportFrom ? new Date(exportFrom).getTime() : 0;
    const toDate = exportTo ? new Date(exportTo).getTime() : Date.now();
    const exportBookings = filteredBookings.filter(b => {
      const created = new Date(b.createdAt || b.created_at).getTime();
      return created >= fromDate && created <= toDate;
    });
    if (exportBookings.length === 0) return alert('No bookings in selected range');
    // Convert to worksheet
    const ws = XLSX.utils.json_to_sheet(exportBookings);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'LodgingBookings');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), `lodging_bookings_${exportFrom || 'all'}_${exportTo || 'all'}.xlsx`);
  };
  const [timeFilter, setTimeFilter] = useState<'all' | '3hrs' | '1day'>('all');

  // Filter bookings by time
  const now = Date.now();
  const filteredBookings = bookings.filter(b => {
    if (timeFilter === 'all') return true;
    const created = new Date(b.createdAt || b.created_at).getTime();
    if (timeFilter === '3hrs') return now - created <= 3 * 60 * 60 * 1000;
    if (timeFilter === '1day') return now - created <= 24 * 60 * 60 * 1000;
    return true;
  });
  console.log('LodgingBookings received:', bookings);
  const [lodgingDetails, setLodgingDetails] = useState<{ [id: number]: any }>({});
  const [modal, setModal] = useState<{ type: 'lodging', data: any } | null>(null);
  const [activeTab, setActiveTab] = useState<'confirmed' | 'pending'>('confirmed');

  const backendUrl = (import.meta as any).env.VITE_BACKEND_URL?.replace(/\/$/, '');

  useEffect(() => {
    const lodgingIds = Array.from(new Set(bookings.map(b => b.lodging_id)));

    // Only fetch lodging details for bookings that don't already include a room snapshot
    lodgingIds.forEach(id => {
      const hasSnapshot = bookings.some(b => b.lodging_id === id && (b.room_name || b.room_type || b.room_price));
      if (!hasSnapshot && !lodgingDetails[id]) {
        fetch(`${backendUrl}/api/lodgings/${id}`)
          .then(res => res.json())
          .then(data => {
            setLodgingDetails(prev => ({ ...prev, [id]: data }));
          })
          .catch(() => {});
      }
    });
  }, [bookings]);

  const confirmed = bookings.filter(b => b.status === 'confirmed');
  const pending = bookings.filter(b => b.status !== 'confirmed');

  const renderBooking = (booking: any) => {
  const lodging = booking.room_name ? {
    id: booking.lodging_id,
    name: booking.room_name,
    type: booking.room_type,
    price: booking.room_price,
    occupancy: booking.room_occupancy,
    amenities: booking.room_amenities,
    image_urls: booking.room_image_urls,
    description: booking.room_description,
  } : lodgingDetails[booking.lodging_id];

    return (
      <div key={booking.id} className="border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium">{booking.guest_name}</h3>
            <p className="text-sm text-gray-600">{booking.guest_email}</p>
            {booking.guest_phone && (
              <p className="text-sm text-gray-600">{booking.guest_phone}</p>
            )}
            {booking.special_requests && (
              <p className="text-xs text-gray-500 mt-1">Special: {booking.special_requests}</p>
            )}
          </div>
          <div>
            <p className="text-sm">
              <strong>Room:</strong>{' '}
              {lodging ? (
                <button
                  type="button"
                  className="text-blue-600 underline hover:text-blue-800 bg-transparent border-none p-0 cursor-pointer"
                  onClick={() => setModal({ type: 'lodging', data: lodging })}
                >
                  {lodging.name || `Lodging #${lodging.id}`}
                </button>
              ) : 'N/A'}
            </p>
            {lodging && (
              <>
                <p className="text-xs text-gray-700">Type: {lodging.type}</p>
                <p className="text-xs text-gray-700">Price: ₦{lodging.price?.toLocaleString()}</p>
                <p className="text-xs text-gray-700">Occupancy: {lodging.occupancy}</p>
              </>
            )}
            <p className="text-sm">
              <strong>Dates:</strong> {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'N/A'} to {booking.end_date ? new Date(booking.end_date).toLocaleDateString() : 'N/A'}
            </p>
            <p className="text-sm">
              <strong>Guests:</strong> {booking.guests}</p>
            {booking.reference && (
              <p className="text-xs text-gray-500">Ref: {booking.reference}</p>
            )}
          </div>
          <div>
            <p className="text-sm">
              <strong>Status:</strong> {booking.status}</p>
            <p className="text-xs text-gray-500">Created: {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : ''}</p>
            <p className="text-xs text-gray-500">Updated: {booking.updatedAt ? new Date(booking.updatedAt).toLocaleString() : ''}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lodging Bookings</CardTitle>
        </CardHeader>
        <div className="flex flex-wrap gap-4 px-6 pt-4 items-center">
          <button
            className={`px-4 py-2 rounded-t ${activeTab === 'confirmed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('confirmed')}
          >
            Confirmed
          </button>
          <button
            className={`px-4 py-2 rounded-t ${activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <select
            className="ml-4 px-2 py-1 border rounded"
            value={timeFilter}
            onChange={e => setTimeFilter(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="3hrs">Last 3 hours</option>
            <option value="1day">Last 1 day</option>
          </select>
          <div className="flex items-center gap-2 ml-4">
            <label>From:</label>
            <input type="datetime-local" value={exportFrom} onChange={e => setExportFrom(e.target.value)} className="border rounded px-2 py-1" />
            <label>To:</label>
            <input type="datetime-local" value={exportTo} onChange={e => setExportTo(e.target.value)} className="border rounded px-2 py-1" />
            <button onClick={handleExport} className="bg-green-600 text-white px-3 py-1 rounded">Export</button>
          </div>
        </div>
        <CardContent>
          {filteredBookings && filteredBookings.length > 0 ? (
            <>
              {activeTab === 'confirmed' ? (
                <div className="space-y-4">
                  {filteredBookings.filter(b => b.status === 'confirmed').length > 0 ? filteredBookings.filter(b => b.status === 'confirmed').map(renderBooking) : <div className="text-gray-500">No confirmed bookings.</div>}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.filter(b => b.status !== 'confirmed').length > 0 ? filteredBookings.filter(b => b.status !== 'confirmed').map(renderBooking) : <div className="text-gray-500">No pending bookings.</div>}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No bookings found.
            </div>
          )}
        </CardContent>
      </Card>
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw] relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setModal(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-2">Room Details</h2>
            <div className="space-y-1">
              {modal.data.image_urls && Array.isArray(modal.data.image_urls) && modal.data.image_urls.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {modal.data.image_urls.map((url: string, idx: number) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Room image ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
              {modal.data.type && (
                <div>
                  <span className="font-semibold">Type:</span> {modal.data.type}
                </div>
              )}
              {modal.data.occupancy && (
                <div>
                  <span className="font-semibold">Occupancy:</span> {modal.data.occupancy}
                </div>
              )}
              {Object.entries(modal.data).map(([key, value]) => {
                if (["image_urls", "type", "occupancy"].includes(key)) return null;
                return (
                  <div key={key}>
                    <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                    <span>{typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LodgingBookings;
