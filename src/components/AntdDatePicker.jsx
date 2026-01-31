
import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const AntdDatePicker = ({ value, onChange, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());

    // Parse value if string
    const selectedDate = value ? new Date(value) : null;

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
    });

    const handleDateClick = (date) => {
        const dateString = format(date, 'yyyy-MM-dd');
        onChange(date, dateString);
        setIsOpen(false);
    };

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    return (
        <div className="relative w-full">
            <div
                className={`flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-[#3D2B1F] transition-colors bg-white ${className}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={`text-base ${selectedDate ? 'text-gray-900' : 'text-gray-400'}`}>
                    {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'Select date'}
                </div>
                <CalendarIcon size={18} className="text-gray-400" />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-xl shadow-xl border border-gray-100 w-full z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-600">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="font-semibold text-gray-800">
                            {format(currentMonth, 'MMMM yyyy')}
                        </span>
                        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-600">
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="text-center text-xs font-semibold text-gray-400 py-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {daysInMonth.map((date) => {
                            const isSelected = selectedDate && isSameDay(date, selectedDate);
                            const isCurrentMonth = isSameMonth(date, currentMonth);

                            return (
                                <button
                                    key={date.toString()}
                                    onClick={() => handleDateClick(date)}
                                    className={`
                                        h-10 w-full rounded-lg text-sm flex items-center justify-center transition-all
                                        ${isSelected
                                            ? 'bg-[#3D2B1F] text-white font-bold shadow-md'
                                            : 'hover:bg-[#3D2B1F]/10 text-gray-700'}
                                        ${isToday(date) && !isSelected ? 'border border-[#3D2B1F] text-[#3D2B1F]' : ''}
                                    `}
                                >
                                    {format(date, 'd')}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            )}
        </div>
    );
};

export default AntdDatePicker;
