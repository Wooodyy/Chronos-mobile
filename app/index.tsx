import { requestRecordingPermissionsAsync } from 'expo-audio';
import React, { useEffect } from 'react';
import { Alert, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const INJECTED_JAVASCRIPT = `(function() {
  var meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
  document.head.appendChild(meta);

  var style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(
    \`
    html, body, * {
      touch-action: pan-y pan-x;
      overscroll-behavior: contain;
    }
    input, textarea, select {
      font-size: 16px !important;
    }
    \`
  ));
  document.head.appendChild(style);

  document.addEventListener('gesturestart', function(e) { e.preventDefault(); }, { passive: false });
  document.addEventListener('gesturechange', function(e) { e.preventDefault(); }, { passive: false });
  document.addEventListener('gestureend', function(e) { e.preventDefault(); }, { passive: false });
})();`;

const MyWebView = () => {
  const statusBarColor = '#000';

  useEffect(() => {
    const askMicrophonePermission = async () => {
      const { status } = await requestRecordingPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Микрофон', 'Разрешение не предоставлено. Некоторые функции могут не работать.');
      }
    };

    askMicrophonePermission();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={statusBarColor} barStyle="light-content" />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: statusBarColor }]} edges={['top', 'left', 'right']}>
        <WebView
          source={{ uri: 'https://finatraker.netlify.app' }}
          injectedJavaScript={INJECTED_JAVASCRIPT}
          injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT}
          onMessage={() => { }}
          scalesPageToFit={false}
          setBuiltInZoomControls={false}
          setDisplayZoomControls={false}
          bounces={false}
          overScrollMode="never"
          javaScriptEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          style={styles.webview}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#18181b',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default MyWebView;
