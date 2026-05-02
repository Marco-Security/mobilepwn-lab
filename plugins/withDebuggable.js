// plugins/withDebuggable.js
//
// Config plugin que añade android:debuggable="true" al AndroidManifest.xml
// durante el build. Esto permite usar `adb run-as` contra el APK resultante,
// algo necesario para los ejercicios introductorios de MobilePwn Lab.
//
// IMPORTANTE: Este flag NUNCA debe estar activo en una app de producción real.
// Aquí lo usamos intencionalmente porque la app es un laboratorio educativo.

const { withAndroidManifest } = require('expo/config-plugins');

module.exports = function withDebuggable(config) {
  return withAndroidManifest(config, (config) => {
    // Buscamos el nodo <application> dentro del manifest
    const application = config.modResults.manifest.application[0];

    // Forzamos debuggable=true en el manifest final
    application.$['android:debuggable'] = 'true';

    return config;
  });
};