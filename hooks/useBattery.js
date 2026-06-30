import { useState, useEffect } from 'react';
import * as Battery from 'expo-battery';

export function useBattery() {
  const [isCharging, setIsCharging] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(1.0);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  useEffect(() => {
    const init = async () => {
      const level = await Battery.getBatteryLevelAsync();
      const state = await Battery.getBatteryStateAsync();
      const lowPower = await Battery.isLowPowerModeEnabledAsync();
      setBatteryLevel(level);
      setIsCharging(
        state === Battery.BatteryState.CHARGING ||
        state === Battery.BatteryState.FULL
      );
      setIsLowPowerMode(lowPower);
    };
    init();

    const stateSub = Battery.addBatteryStateListener(({ batteryState }) => {
      setIsCharging(
        batteryState === Battery.BatteryState.CHARGING ||
        batteryState === Battery.BatteryState.FULL
      );
    });

    const levelSub = Battery.addBatteryLevelListener(({ batteryLevel: level }) => {
      setBatteryLevel(level);
    });

    const lowPowerSub = Battery.addLowPowerModeListener(({ lowPowerMode }) => {
      setIsLowPowerMode(lowPowerMode);
    });

    return () => {
      stateSub.remove();
      levelSub.remove();
      lowPowerSub.remove();
    };
  }, []);

  return { isCharging, batteryLevel, isLowPowerMode };
}