import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Path, Rect } from 'react-native-svg';
import { useNotifications } from '../hooks/useNotifications';
import { useDeviceMetrics } from '../hooks/useDeviceMetrics';

const DAYS   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)  return 'now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
// ── アイコンコンポーネント（SVGで本物に近い形を再現） ──────────────

function SignalIcon({ color = '#fff' }) {
  return (
    <Svg width="18" height="12" viewBox="0 0 18 12">
      <Rect x="0" y="7" width="3" height="5" rx="0.5" fill={color} />
      <Rect x="4.5" y="5" width="3" height="7" rx="0.5" fill={color} />
      <Rect x="9" y="3" width="3" height="9" rx="0.5" fill={color} />
      <Rect x="13.5" y="0" width="3" height="12" rx="0.5" fill={color} />
    </Svg>
  );
}

function WifiIcon({ color = '#fff' }) {
  return (
    <Svg width="16" height="12" viewBox="0 0 16 12">
      <Path
        d="M8 10.5C8.69 10.5 9.25 9.94 9.25 9.25C9.25 8.56 8.69 8 8 8C7.31 8 6.75 8.56 6.75 9.25C6.75 9.94 7.31 10.5 8 10.5Z"
        fill={color}
      />
      <Path
        d="M8 6C9.38 6 10.63 6.56 11.54 7.46L10.46 8.54C9.81 7.9 8.95 7.5 8 7.5C7.05 7.5 6.19 7.9 5.54 8.54L4.46 7.46C5.37 6.56 6.62 6 8 6Z"
        fill={color}
      />
      <Path
        d="M8 2.5C10.6 2.5 12.96 3.55 14.66 5.27L13.59 6.34C12.16 4.9 10.18 4 8 4C5.82 4 3.84 4.9 2.41 6.34L1.34 5.27C3.04 3.55 5.4 2.5 8 2.5Z"
        fill={color}
      />
    </Svg>
  );
}

function BatteryIcon({ percent, color, isCharging, isLowPower }) {
  const fillWidth = Math.max(2, ((percent ?? 100) / 100) * 19);
  return (
    <View style={styles.batteryWrapper}>
      {isCharging && (
        <Svg width="9" height="13" viewBox="0 0 9 13" style={{ marginRight: 2 }}>
          <Path d="M5.5 0L0 7.5H3.5L3 13L8.5 5H5L5.5 0Z" fill={isLowPower ? '#FFD60A' : '#fff'} />
        </Svg>
      )}
      <Svg width="25" height="13" viewBox="0 0 25 13">
        {/* 外枠 */}
        <Rect x="1" y="1" width="21" height="11" rx="2.5" stroke="#fff" strokeWidth="1" fill="none" opacity={0.4} />
        {/* 中身 */}
        <Rect x="2.5" y="2.5" width={fillWidth} height="8" rx="1.5" fill={color} />
        {/* 突起 */}
        <Rect x="23" y="4" width="1.5" height="5" rx="0.7" fill="#fff" opacity={0.4} />
      </Svg>
    </View>
  );
}

function FlashlightIcon({ active }) {
  return (
    <Svg width="22" height="22" viewBox="0 0 24 24">
      <Path
        d="M9 2L7 9H10L8 22L17 10H13L16 2H9Z"
        fill={active ? '#000' : '#fff'}
        opacity={active ? 1 : 0.95}
      />
    </Svg>
  );
}

function CameraIcon() {
  return (
    <Svg width="23" height="20" viewBox="0 0 24 22">
      <Path
        d="M8 2L6.5 4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H21C22.1 20 23 19.1 23 18V6C23 4.9 22.1 4 21 4H17.5L16 2H8Z"
        fill="#fff"
        opacity={0.95}
      />
      <Path
        d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
        fill="rgba(0,0,0,0.4)"
      />
    </Svg>
  );
}

// ── メインコンポーネント ──────────────────────────────────────

export function LockScreen({
  isCharging,
  batteryLevel,
  isLowPowerMode,
  onFlashlightPress,
  isFlashlightOn,
  onCameraPress,
}) {
  const [now, setNow] = useState(new Date());
  const { notifications, dismissNotification, dismissAll } = useNotifications();
  const {
  insets,
  width,
  hasDynamicIsland,
  hasNotch,
  hasHomeButton,
  clockFontSize,
  dateFontSize,
  statusTimeFontSize,
  circleButtonSize,
  dynamicIslandWidth,
} = useDeviceMetrics();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours   = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const day     = DAYS[now.getDay()];
  const month   = MONTHS[now.getMonth()];
  const date    = now.getDate();

  const batteryPercent = batteryLevel >= 0 ? Math.round(batteryLevel * 100) : null;
  const batteryColor =
  isLowPowerMode ? '#FFD60A' :
  isCharging ? '#34C759' :
  batteryPercent !== null && batteryPercent <= 20 ? '#FF453A' :
  '#ffffff';

  const statusBarTop = hasDynamicIsland ? 4 : hasNotch ? 4 : 8;
  const statusBarPadH = hasDynamicIsland ? 30 : 22;

  return (
    <View style={styles.container}>

      {/* ── ステータスバー ── */}
{hasDynamicIsland ? (
  // Dynamic Island搭載機種：左右に分割配置
  <View style={[styles.statusBarSplit, { marginTop: insets.top * 0.4 }]}>
    <View style={[styles.statusBarSide, { width: (width - dynamicIslandWidth) / 2 - 16 }]}>
      <Text style={[styles.statusTime, { fontSize: statusTimeFontSize }]}>
        {hours}:{minutes}
      </Text>
    </View>

    {/* Dynamic Islandの実寸分の空白 */}
    <View style={{ width: dynamicIslandWidth }} />

    <View style={[styles.statusBarSide, styles.statusBarSideRight, { width: (width - dynamicIslandWidth) / 2 - 16 }]}>
      <SignalIcon />
      <WifiIcon />
      <BatteryIcon
        percent={batteryPercent}
        color={batteryColor}
        isCharging={isCharging}
        isLowPower={isLowPowerMode}
      />
    </View>
  </View>
) : (
  // ノッチ機種・ホームボタン機種：通常配置
  <View style={[styles.statusBar, { marginTop: hasNotch ? 4 : 8, paddingHorizontal: 22 }]}>
    <Text style={[styles.statusTime, { fontSize: statusTimeFontSize }]}>
      {hours}:{minutes}
    </Text>
    <View style={styles.statusRight}>
      <SignalIcon />
      <WifiIcon />
      <BatteryIcon
        percent={batteryPercent}
        color={batteryColor}
        isCharging={isCharging}
        isLowPower={isLowPowerMode}
      />
    </View>
  </View>
)}

      {/* ── 日付・時計 ── */}
      {/* 日付 */}
      <View style={styles.dateArea}>
        <Text style={[styles.dateText, { fontSize: dateFontSize }]}>
          {day}, {date} {month}
        </Text>
      </View>

      <View style={styles.clockArea}>
        <Text style={[styles.clockText, { fontSize: clockFontSize, lineHeight: clockFontSize * 1.0 }]}>
          {hours}:{minutes}
        </Text>
      </View>

      {/* ── 通知エリア ── */}
      <ScrollView
        style={styles.notificationScroll}
        contentContainerStyle={styles.notificationContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={styles.noNotifArea} />
        ) : (
          <>
            {notifications.length > 1 && (
              <TouchableOpacity onPress={dismissAll} style={styles.clearAllButton}>
                <BlurView intensity={65} tint="systemChromeMaterialDark" style={styles.clearAllBlur}>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </BlurView>
              </TouchableOpacity>
            )}
            {notifications.map(notif => (
              <NotificationCard
                key={notif.id}
                notif={notif}
                onDismiss={() => dismissNotification(notif.id)}
              />
            ))}
          </>
        )}
      </ScrollView>

      {/* ── 下部コントロール ── */}
      <View style={{ position: 'relative' }}>
        <View style={[
          styles.bottomArea,
          { marginBottom: hasHomeButton ? 30 : insets.bottom > 0 ? insets.bottom + 18 : 30 }
        ]}>
          <TouchableOpacity onPress={onFlashlightPress} activeOpacity={0.6}>
            <BlurView
              intensity={50}
              tint="systemChromeMaterialDark"
              style={[
                styles.circleButton,
                { width: circleButtonSize, height: circleButtonSize, borderRadius: circleButtonSize / 2 },
                isFlashlightOn && styles.circleButtonActive,
              ]}
            >
              <FlashlightIcon active={isFlashlightOn} />
            </BlurView>
          </TouchableOpacity>

          <View style={{ width: circleButtonSize }} />

          <TouchableOpacity onPress={onCameraPress} activeOpacity={0.6}>
            <BlurView
              intensity={50}
              tint="systemChromeMaterialDark"
              style={[
                styles.circleButton,
                { width: circleButtonSize, height: circleButtonSize, borderRadius: circleButtonSize / 2 },
              ]}
            >
              <CameraIcon />
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* スワイプバー：画面の本当の最下端に固定 */}
        <View style={[styles.swipeHint, { bottom: hasHomeButton ? 8 : Math.max(insets.bottom - 25, 4) }]}>
          <View style={styles.swipeLine} />
        </View>
      </View>

    </View>
  );
}

function NotificationCard({ notif, onDismiss }) {
  return (
    <TouchableOpacity onLongPress={onDismiss} activeOpacity={0.9}>
      <BlurView intensity={65} tint="systemChromeMaterialDark" style={styles.notifCard}>
        <View style={styles.notifHeader}>
          <View style={styles.notifAppIcon} />
          <Text style={styles.notifApp}>{notif.app.toUpperCase()}</Text>
          <Text style={styles.notifTime}>{timeAgo(notif.time)}</Text>
        </View>
        {notif.title ? <Text style={styles.notifTitle}>{notif.title}</Text> : null}
        {notif.body ? <Text style={styles.notifBody} numberOfLines={2}>{notif.body}</Text> : null}
      </BlurView>
    </TouchableOpacity>
  );
}

const SF = Platform.select({
  ios: 'System', // iOSは標準でSan Franciscoが適用される
  default: 'System',
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  // ステータスバー
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTime: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: SF,
    letterSpacing: -0.2,
  },
  statusBarSplit: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  },
  statusBarSide: {
  flexDirection: 'row',
  alignItems: 'center',
  },
  statusBarSideRight: {
  justifyContent: 'flex-end',
  gap: 5,
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  batteryWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // 日付・時計
  dateArea: {
    alignItems: 'center',
    marginTop: 24,
  },
  dateText: {
  color: '#fff',
  fontSize: 20,        // 17 → 20
  fontWeight: '600',
  fontFamily: SF,
  letterSpacing: 0,
  textShadowColor: 'rgba(0,0,0,0.35)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 6,
  },
  clockArea: {
    alignItems: 'center',
    marginTop: 2,
  },
  clockText: {
    color: '#fff',
    fontWeight: '500',
    fontFamily: SF,
    letterSpacing: -2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },

  // 通知
  notificationScroll: { flex: 1, marginTop: 24 },
  notificationContent: { gap: 10, paddingBottom: 8 },
  noNotifArea: { height: 4 },
  clearAllButton: {
    alignSelf: 'flex-end',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 2,
  },
  clearAllBlur: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clearAllText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: SF,
  },
  notifCard: {
    borderRadius: 18,
    overflow: 'hidden',
    padding: 14,
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  notifAppIcon: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  notifApp: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: SF,
    letterSpacing: 0.5,
    flex: 1,
  },
  notifTime: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontFamily: SF,
  },
  notifTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: SF,
    marginBottom: 2,
  },
  notifBody: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontFamily: SF,
    lineHeight: 19,
  },

  // 下部
  bottomArea: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-end',  // center → flex-end に変更（懐中電灯・カメラは下揃え）
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleButtonActive: {
    backgroundColor: '#fff',
  },
  swipeHint: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  alignItems: 'center',
  },
  swipeLine: {
    width: 140,
    height: 5,
    backgroundColor: '#fff',
    borderRadius: 3,
    opacity: 0.95,
  },
});