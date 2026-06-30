import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CameraView } from 'expo-camera';
import { useBattery } from './hooks/useBattery';
import { useFlashlight } from './hooks/useFlashlight';
import { VideoBackground } from './components/VideoBackground';
import { LockScreen } from './components/LockScreen';

// ── 動画の設定 ──────────────────────────────────────────────
const CHARGING_VIDEOS = [
  require('./assets/videos/charging/c1.mp4'),
  require('./assets/videos/charging/c2.mp4'),
  require('./assets/videos/charging/c3.mp4'),
  require('./assets/videos/charging/c4.mp4'),
  require('./assets/videos/charging/c5.mp4'),
  require('./assets/videos/charging/c6.mp4'),
  require('./assets/videos/charging/c7.mp4'),
  require('./assets/videos/charging/c8.mp4'),
  require('./assets/videos/charging/c9.mp4'),
  require('./assets/videos/charging/c10.mp4'),
  require('./assets/videos/charging/c11.mp4'),
  require('./assets/videos/charging/c12.mp4'),
];

const NORMAL_VIDEOS = [
  require('./assets/videos/normal/n1.mp4'),
  require('./assets/videos/normal/n2.mp4'),
  //require('./assets/videos/normal/n3.mp4'),
  require('./assets/videos/normal/n4.mp4'),
  require('./assets/videos/normal/n5.mp4'),
  require('./assets/videos/normal/n6.mp4'),
  require('./assets/videos/normal/n7.mp4'),
  require('./assets/videos/normal/n8.mp4'),
  require('./assets/videos/normal/n9.mp4'),
  require('./assets/videos/normal/n10.mp4'),
  require('./assets/videos/normal/n11.mp4'),
  require('./assets/videos/normal/n12.mp4'),
  require('./assets/videos/normal/n13.mp4'),
];

const LOW_BATTERY_VIDEO = require('./assets/videos/low_battery.mp4');
const LOW_POWER_VIDEO    = require('./assets/videos/low_power.mp4');
// ──────────────────────────────────────────────────────────────

function getRandomVideo(videos) {
  return videos[Math.floor(Math.random() * videos.length)];
}

function getMode(isCharging, batteryLevel, isLowPowerMode) {
  if (isLowPowerMode) return 'lowPower';
  if (batteryLevel >= 0 && batteryLevel <= 0.20) return 'lowBattery';
  if (isCharging) return 'charging';
  return 'normal';
}

function AppContent() {
  const { isCharging, batteryLevel, isLowPowerMode } = useBattery();
  const flashlight = useFlashlight();
  const prevMode = useRef(null);
  const [videoSource, setVideoSource] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    const mode = getMode(isCharging, batteryLevel, isLowPowerMode);
    if (mode === prevMode.current) return;
    prevMode.current = mode;

    switch (mode) {
      case 'lowPower':
        setVideoSource(LOW_POWER_VIDEO);
        break;
      case 'lowBattery':
        setVideoSource(LOW_BATTERY_VIDEO);
        break;
      case 'charging':
        setVideoSource(getRandomVideo(CHARGING_VIDEOS));
        break;
      case 'normal':
      default:
        setVideoSource(getRandomVideo(NORMAL_VIDEOS));
        break;
    }
  }, [isCharging, batteryLevel, isLowPowerMode]);

  if (!videoSource) return null;

  // カメラ起動中はカメラのプレビュー画面を表示
  if (showCamera) {
    return (
      <View style={styles.container}>
        <CameraView style={StyleSheet.absoluteFill} facing="back" />
        <View style={styles.cameraCloseArea}>
          <View style={styles.cameraCloseButton} onTouchEnd={() => setShowCamera(false)}>
            <View style={styles.cameraCloseIcon} />
          </View>
        </View>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <VideoBackground source={videoSource} />

      {/* 懐中電灯ON時の白フラッシュ表現（背面ライトは実機のみ反映） */}
      {flashlight.isOn && <View style={styles.flashOverlay} />}

      <LockScreen
        isCharging={isCharging}
        batteryLevel={batteryLevel}
        isLowPowerMode={isLowPowerMode}
        onFlashlightPress={flashlight.toggle}
        isFlashlightOn={flashlight.isOn}
        onCameraPress={() => setShowCamera(true)}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  cameraCloseArea: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  cameraCloseButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraCloseIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
});