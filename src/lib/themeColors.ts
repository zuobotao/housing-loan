export type Theme = 'apple' | 'warhammer';

export const getChartColors = (theme: Theme) => {
  if (theme === 'warhammer') {
    return {
      primary: '#d4a853',
      primaryLight: '#e8c77a',
      secondary: '#8b1a1a',
      secondaryLight: '#c42525',
      success: '#4a7c3a',
      warning: '#8b1a1a',
      info: '#3a6b7c',
      purple: '#6b3a7c',
      grid: '#3d332a',
      text: '#8a7d6d',
      textStrong: '#d9cfc2',
      gradient: {
        primary: ['#d4a853', '#8b6914'],
        secondary: ['#8b1a1a', '#5c0f0f'],
      },
    };
  }
  return {
    primary: '#007AFF',
    primaryLight: '#66abff',
    secondary: '#FF9500',
    secondaryLight: '#FFB74D',
    success: '#34C759',
    warning: '#FF9500',
    info: '#5856d6',
    purple: '#AF52DE',
    grid: '#e5e5ea',
    text: '#8e8e93',
    textStrong: '#1d1d1f',
    gradient: {
      primary: ['#007AFF', '#004fad'],
      secondary: ['#FF9500', '#b26900'],
    },
  };
};
