import React from 'react';
import { Icons } from '../components/Icons';
import { Room } from '../types';

interface ConfirmationProps {
  onDashboard: () => void;
  selectedRoom: Room | null;
  bookingDate?: string;
  bookingStartTime?: string;
  bookingEndTime?: string;
}

export const Confirmation: React.FC<ConfirmationProps> = ({
  onDashboard, selectedRoom, bookingDate, bookingStartTime, bookingEndTime
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-3xl mb-12">
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-brand rounded-full"></div>
          <div className="flex justify-between w-full relative z-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold shadow-lg ring-4 ring-white">
                  <Icons.Check className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-center">
        <div className="h-2 w-full bg-gradient-to-r from-brand via-blue-400 to-brand"></div>
        <div className="p-8 sm:p-12">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Icons.Check className="text-white h-10 w-10" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking request sent<br />for approval</h1>
          <p className="text-lg text-gray-500 mb-8">
            Great! Your request for <span className="text-gray-900 font-semibold">{selectedRoom?.name || 'the room'}</span> has been submitted.
          </p>

          {selectedRoom && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-200">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icons.FileText className="h-4 w-4" /> Request Summary
              </h3>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-white shadow-sm border border-gray-100 p-1 shrink-0">
                  <img src={selectedRoom.image} className="w-full h-full object-cover rounded" alt={selectedRoom.name} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{selectedRoom.name}</p>
                  <p className="text-sm text-gray-500">{selectedRoom.location}</p>
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 my-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                    <Icons.Calendar className="h-4 w-4 text-brand" /> {bookingDate || '—'}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Time</p>
                  <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                    <Icons.Clock className="h-4 w-4 text-brand" /> {bookingStartTime && bookingEndTime ? `${bookingStartTime} - ${bookingEndTime}` : '—'}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg text-left mb-8 border border-blue-100">
            <Icons.AlertCircle className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600">The faculty admin will review your request shortly. You will receive a notification once approved or rejected.</p>
          </div>

          <button onClick={onDashboard} className="w-full bg-brand hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
            Back to Dashboard <Icons.ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
