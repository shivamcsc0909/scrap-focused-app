const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'zustand') {
    return {
      filePath: require.resolve('zustand'),
      type: 'sourceFile',
    };
  }
  if (moduleName === 'zustand/middleware') {
    return {
      filePath: require.resolve('zustand/middleware'),
      type: 'sourceFile',
    };
  }
  if (moduleName.startsWith('zustand/')) {
    const sub = moduleName.replace('zustand/', '');
    try {
      return {
        filePath: require.resolve(`zustand/${sub}`),
        type: 'sourceFile',
      };
    } catch (e) {}
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
