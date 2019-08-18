import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
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

const Progress = ({ isLoading }) => {
  if (!isLoading) return null;

  const completed = useProgress();

  return (
    <LinearProgress variant="determinate" value={completed} color="secondary" />
  );
};

Progress.propTypes = {
  isLoading: PropTypes.bool
};

export default Progress;
