
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RoomAvailabilityCalendarProps {
  roomId: string;
  onDateSelect: (date: Date | undefined) => void;
  selectedDate?: Date;
  isCheckOut?: boolean;
  checkInDate?: string;
}

const RoomAvailabilityCalendar = ({ 
  roomId, 
  onDateSelect, 
  selectedDate, 
  isCheckOut = false,
  checkInDate 
}: RoomAvailabilityCalendarProps) => {
  const { data: bookings } = useQuery({
    queryKey: ['room-bookings', roomId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('check_in_date, check_out_date, status')
        .eq('room_id', roomId)
        .in('status', ['confirmed', 'checked_in']);
      
      if (error) throw error;
      return data;
    }
  });

  const isDateBooked = (date: Date) => {
    if (!bookings) return false;
    
    const dateStr = date.toISOString().split('T')[0];
    return bookings.some(booking => {
      const checkIn = new Date(booking.check_in_date);
      const checkOut = new Date(booking.check_out_date);
      const currentDate = new Date(dateStr);
      
      return currentDate >= checkIn && currentDate < checkOut;
    });
  };

  const getBookingEndTime = (date: Date) => {
    if (!bookings) return null;
    
    const dateStr = date.toISOString().split('T')[0];
    const booking = bookings.find(booking => {
      const checkOut = new Date(booking.check_out_date);
      return checkOut.toISOString().split('T')[0] === dateStr;
    });
    
    return booking ? new Date(booking.check_out_date) : null;
  };

  const modifiers = {
    booked: (date: Date) => isDateBooked(date),
    checkout: (date: Date) => {
      const endTime = getBookingEndTime(date);
      return !!endTime;
    }
  };

  const modifiersStyles = {
    booked: {
      backgroundColor: '#ef4444',
      color: 'white'
    },
    checkout: {
      backgroundColor: '#f59e0b',
      color: 'white'
    }
  };

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        disabled={(date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (date < today) return true;
          
          if (isCheckOut && checkInDate) {
            const checkIn = new Date(checkInDate);
            return date <= checkIn;
          }
          
          return isDateBooked(date);
        }}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        className={cn("p-3 pointer-events-auto")}
      />
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Occupied</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-amber-500 rounded"></div>
          <span>Check-out day</span>
        </div>
      </div>
    </div>
  );
};

export default RoomAvailabilityCalendar;
