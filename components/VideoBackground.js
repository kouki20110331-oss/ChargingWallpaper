import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export function VideoBackground({ source }) {
  const videoRef = useRef(null);
  const [displaySource, setDisplaySource] = useState(source);

  useEffect(() => {
    setDisplaySource(source);
    if (videoRef.current) {
      videoRef.current.playAsync();
    }
  }, [source]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Video
        ref={videoRef}
        source={displaySource}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
        isMuted
        progressUpdateIntervalMillis={500}
        onError={(error) => console.log('動画再生エラー:', error)}
        onLoad={() => console.log('動画ロード完了')}
      />
    </View>
  );
}