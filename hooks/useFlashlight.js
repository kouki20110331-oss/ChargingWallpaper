import { useState, useCallback } from 'react';
import { Camera } from 'expo-camera';

export function useFlashlight() {
  const [isOn, setIsOn] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  const toggle = useCallback(async () => {
    // 権限チェック
    if (hasPermission === null) {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      if (!granted) return;
    } else if (!hasPermission) {
      return;
    }

    setIsOn(prev => !prev);
  }, [hasPermission]);

  return { isOn, toggle, hasPermission };
}