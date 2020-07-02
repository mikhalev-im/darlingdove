import React, { useEffect, useState, FunctionComponent } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

const useProgress = () => {
  const [completed, setCompleted] = useState(25);

  useEffect(() => {
    function progress() {
      setCompleted(oldCompleted => {
        if (oldCompleted === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldCompleted + diff, 100);
      });
    }

    const timer = setInterval(progress, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return completed;
};

interface Progress {
  isLoading: boolean;
}

const Progress: FunctionComponent<Progress> = ({ isLoading }) => {
  if (!isLoading) return null;

  const completed = useProgress();

  return (
    <LinearProgress variant="determinate" value={completed} color="secondary" />
  );
};

export default Progress;
