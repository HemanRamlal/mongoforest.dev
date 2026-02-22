import { useState, useEffect } from 'react';
import { getFromLS, setToLS } from '../utils/storage';
import _ from "lodash";
import themes from './schema.json';

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    return getFromLS('theme') || 'light';
  });

  useEffect(() => {
    setToLS('theme', theme);
  }, [theme]);

  return { theme, setTheme};
}
