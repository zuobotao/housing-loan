export type Theme = 'apple' | 'warhammer' | 'wulin' | 'renmin' | 'daming' | 'rickmorty' | 'harrypotter';

export const getChartColors = (theme: Theme) => {
  switch (theme) {
    case 'warhammer':
      return {
        primary: '#dc143c',
        primaryLight: '#ff0033',
        secondary: '#cd7f32',
        secondaryLight: '#ffd700',
        success: '#00ff41',
        warning: '#b8860b',
        info: '#8b00ff',
        purple: '#aa00ff',
        grid: '#2e1015',
        text: '#8a6850',
        textStrong: '#e8dcc4',
        gradient: {
          primary: ['#dc143c', '#3d0000'],
          secondary: ['#cd7f32', '#6b4e00'],
        },
      };
    case 'wulin':
      return {
        primary: '#a0322c',
        primaryLight: '#c94b44',
        secondary: '#c9a96a',
        secondaryLight: '#d8bd85',
        success: '#5a7a3e',
        warning: '#8b6914',
        info: '#6b5a4a',
        purple: '#7a4a6a',
        grid: '#d8c89a',
        text: '#7a5e42',
        textStrong: '#4a3728',
        gradient: {
          primary: ['#c94b44', '#7a221c'],
          secondary: ['#d8bd85', '#a0854a'],
        },
      };
    case 'renmin':
      return {
        primary: '#c5221f',
        primaryLight: '#e8453c',
        secondary: '#5f6368',
        secondaryLight: '#80868b',
        success: '#1a73e8',
        warning: '#e37400',
        info: '#1a73e8',
        purple: '#8430ce',
        grid: '#dadce0',
        text: '#5f6368',
        textStrong: '#202124',
        gradient: {
          primary: ['#e8453c', '#a50e0e'],
          secondary: ['#80868b', '#3c4043'],
        },
      };
    case 'daming':
      return {
        primary: '#8b3a3a',
        primaryLight: '#a04a4a',
        secondary: '#a08050',
        secondaryLight: '#c0a070',
        success: '#4a6b5a',
        warning: '#8b6914',
        info: '#3a5b6b',
        purple: '#6b3a5a',
        grid: '#b5a98f',
        text: '#6b5d48',
        textStrong: '#3d3528',
        gradient: {
          primary: ['#a04a4a', '#6b2a2a'],
          secondary: ['#c0a070', '#806030'],
        },
      };
    case 'rickmorty':
      return {
        primary: '#2bd42b',
        primaryLight: '#3aef3a',
        secondary: '#ffd700',
        secondaryLight: '#ffe44d',
        success: '#00bfff',
        warning: '#ff69b4',
        info: '#00bfff',
        purple: '#9932cc',
        grid: 'rgba(153, 50, 204, 0.3)',
        text: '#a0b0c0',
        textStrong: '#f0f0f0',
        gradient: {
          primary: ['#3aef3a', '#1a9a1a'],
          secondary: ['#ffd700', '#b8960b'],
        },
      };
    case 'harrypotter':
      return {
        primary: '#d4af37',
        primaryLight: '#f0d050',
        secondary: '#50c878',
        secondaryLight: '#6ee090',
        success: '#50c878',
        warning: '#d4af37',
        info: '#7b68ee',
        purple: '#9370db',
        grid: 'rgba(212, 175, 55, 0.15)',
        text: '#a89060',
        textStrong: '#e8d5a0',
        gradient: {
          primary: ['#f0d050', '#8b6914'],
          secondary: ['#6ee090', '#2a8050'],
        },
      };
    default: // apple
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
  }
};
