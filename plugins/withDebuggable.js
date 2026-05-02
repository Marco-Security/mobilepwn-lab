// plugins/withDebuggable.js
//
// Config plugin que:
// 1. Agrega android:debuggable="true" al AndroidManifest.xml
// 2. Desactiva la regla de lint HardcodedDebugMode (que normalmente bloquea esto)
//
// Esto es necesario porque MobilePwn Lab es un laboratorio educativo
// que enseña la vulnerabilidad de tener debuggable=true en producción.
// Para que el usuario pueda usar `adb run-as` contra la app, necesitamos
// desactivar la protección de Google contra esta misma vulnerabilidad.
//
// IRONÍA INTENCIONAL: la app es vulnerable a propósito.

const { withAndroidManifest, withAppBuildGradle } = require('expo/config-plugins');

function setDebuggableInManifest(config) {
  return withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application[0];
    application.$['android:debuggable'] = 'true';
    return config;
  });
}

function disableHardcodedDebugLint(config) {
  return withAppBuildGradle(config, (config) => {
    // Si el bloque android { ... } no tiene lintOptions, lo agregamos
    if (!config.modResults.contents.includes('disable "HardcodedDebugMode"')) {
      // Inyectamos un bloque lintOptions justo antes del cierre del bloque android
      config.modResults.contents = config.modResults.contents.replace(
        /android\s*\{/,
        `android {
    lintOptions {
        disable "HardcodedDebugMode"
    }`
      );
    }
    return config;
  });
}

module.exports = function withDebuggable(config) {
  config = setDebuggableInManifest(config);
  config = disableHardcodedDebugLint(config);
  return config;
};