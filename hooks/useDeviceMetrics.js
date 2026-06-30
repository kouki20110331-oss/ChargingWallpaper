import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions, Platform } from 'react-native';

const BASE_WIDTH = 393;

export function useDeviceMetrics() {
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');

  const hasDynamicIsland = Platform.OS === 'ios' && insets.top >= 59;
  const hasNotch = Platform.OS === 'ios' && insets.top > 20 && insets.top < 59;
  const hasHomeButton = Platform.OS === 'ios' && insets.top <= 20;

  const scale = Math.min(Math.max(width / BASE_WIDTH, 0.85), 1.15);
  const rf = (size) => Math.round(size * scale);

  const dynamicIslandWidth = 126;

  return {
    insets,
    width,
    height,
    hasDynamicIsland,
    hasNotch,
    hasHomeButton,
    scale,
    rf,
    dynamicIslandWidth,
    clockFontSize: rf(108),
    dateFontSize: rf(20),
    statusTimeFontSize: rf(16),
    notifTitleFontSize: rf(15),
    notifBodyFontSize: rf(14),
    circleButtonSize: rf(50),
  };
}