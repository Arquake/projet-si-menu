import { useEffect, useState } from "react";


interface ComputedTimeInterface {
    startDate: Date,
    onRemainingTimeChange: (remainingTime: number) => void
}

export default function ComputedRemaingTime({ startDate, onRemainingTimeChange }: ComputedTimeInterface) {
    const [remainingTime, setRemainingTime] = useState<number>(0); // Remaining time in milliseconds
  
    useEffect(() => {
      const endTime = new Date(startDate);
      endTime.setHours(endTime.getHours() + 1); // Add 1 hour to start date
  
      const updateRemainingTime = () => {
        const now = new Date();
        const timeLeft = endTime.getTime() - now.getTime();
        setRemainingTime(timeLeft > 0 ? timeLeft : 0); // Ensure it doesn't go negative
      };
  
      // Update immediately and set an interval
      updateRemainingTime();
      const interval = setInterval(updateRemainingTime, 1000);
  
      // Cleanup the interval on unmount
      return () => clearInterval(interval);
    }, [startDate]);
  
    // Convert remaining time into human-readable format
    const formatTime = (ms: number) => {
      const totalSeconds = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}m ${seconds}s`;
    };
  
    // Call the parent's callback whenever remainingTime changes
    useEffect(() => {
      onRemainingTimeChange(remainingTime);
    }, [remainingTime, onRemainingTimeChange]);
  
    return (
    <>
        {remainingTime > 0 ? formatTime(remainingTime) : 'Plus de temps !'}
    </>);
  }