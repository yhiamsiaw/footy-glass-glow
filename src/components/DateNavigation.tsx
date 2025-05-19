
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DateNavigationProps {
  onDateChange: (date: string) => void;
}

export const DateNavigation = ({ onDateChange }: DateNavigationProps) => {
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 3 + i);
    return date;
  });
  
  const formatDateLabel = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (isTomorrow(date)) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };
  
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
  const isYesterday = (date: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.getDate() === yesterday.getDate() && 
           date.getMonth() === yesterday.getMonth() && 
           date.getFullYear() === yesterday.getFullYear();
  };
  
  const isTomorrow = (date: Date): boolean => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.getDate() === tomorrow.getDate() && 
           date.getMonth() === tomorrow.getMonth() && 
           date.getFullYear() === tomorrow.getFullYear();
  };
  
  const formatDateForAPI = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  const handleDateChange = (index: number) => {
    setCurrentDateIndex(index);
    onDateChange(formatDateForAPI(dates[index]));
  };
  
  const handlePrevious = () => {
    if (currentDateIndex > 0) {
      handleDateChange(currentDateIndex - 1);
    }
  };
  
  const handleNext = () => {
    if (currentDateIndex < dates.length - 1) {
      handleDateChange(currentDateIndex + 1);
    }
  };
  
  return (
    <div className="flex items-center justify-between p-4 bg-[#121212] border-b border-gray-800">
      <button 
        onClick={handlePrevious}
        className="p-2 rounded-full" 
        disabled={currentDateIndex === 0}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      <div className="flex items-center gap-2 font-medium text-lg">
        {formatDateLabel(dates[currentDateIndex])}
        <Calendar className="h-5 w-5 ml-1" />
      </div>
      
      <button 
        onClick={handleNext}
        className="p-2 rounded-full"
        disabled={currentDateIndex === dates.length - 1}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};
