import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AnalyticsPanelProps {
  analytics: any[];
  totalRevenue: number;
  totalBookings: number;
  totalRooms: number;
  availableRooms: number;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ analytics, totalRevenue, totalBookings, totalRooms, availableRooms }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Monthly Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        {analytics && analytics.length > 0 ? (
          <div className="space-y-4">
            {analytics.map((item, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <p className="font-medium">
                  {item.month ? new Date(item.month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                  <div>
                    <p className="text-gray-600">Bookings: {item.total_bookings || 0}</p>
                    <p className="text-gray-600">Unique Guests: {item.unique_guests || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Revenue: ₦{((item.total_revenue || 0) / 100).toLocaleString()}</p>
                    <p className="text-gray-600">Avg. Value: ₦{((item.average_booking_value || 0) / 100).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No analytics data available.
          </div>
        )}
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="text-2xl font-bold text-green-600">
              ₦{(totalRevenue / 100).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
          <div className="border-b pb-4">
            <p className="text-2xl font-bold text-blue-600">{totalBookings}</p>
            <p className="text-sm text-gray-600">Total Bookings</p>
          </div>
          <div className="border-b pb-4">
            <p className="text-2xl font-bold text-purple-600">{totalRooms}</p>
            <p className="text-sm text-gray-600">Total Rooms</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{availableRooms}</p>
            <p className="text-sm text-gray-600">Available Rooms</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AnalyticsPanel;
