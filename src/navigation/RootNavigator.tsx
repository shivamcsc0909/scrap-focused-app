import React from 'react';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Scale,
  PlusCircle,
  ShoppingBag,
  Clock,
  User,
} from 'lucide-react-native';
import { THEME } from '../theme';
import { useSahiStore } from '../store/useSahiStore';
import { TRANSLATIONS } from '../constants/translations';

// Screens
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { LanguageSelectScreen } from '../screens/LanguageSelectScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SellScrapScreen } from '../screens/SellScrapScreen';
import { BuyScrapScreen } from '../screens/BuyScrapScreen';
import { TrackStatusScreen } from '../screens/TrackStatusScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { language } = useSahiStore();
  const t = TRANSLATIONS[language];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          },
        ],
        tabBarActiveTintColor: THEME.colors.primary,
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t.navHome,
          tabBarIcon: ({ color, size }) => <Scale size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="Sell"
        component={SellScrapScreen}
        options={{
          tabBarLabel: t.navSell,
          tabBarIcon: ({ color, size }) => <PlusCircle size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="Buy"
        component={BuyScrapScreen}
        options={{
          tabBarLabel: t.navBuy,
          tabBarIcon: ({ color, size }) => <ShoppingBag size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="Track"
        component={TrackStatusScreen}
        options={{
          tabBarLabel: t.navTrack,
          tabBarIcon: ({ color, size }) => <Clock size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t.navProfile,
          tabBarIcon: ({ color, size }) => <User size={size - 2} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  const { hasSeenWelcome, user } = useSahiStore();
  const [hydrated, setHydrated] = React.useState(useSahiStore.persist?.hasHydrated?.() ?? true);

  React.useEffect(() => {
    let timeout: any;
    if (useSahiStore.persist?.onFinishHydration) {
      const unsub = useSahiStore.persist.onFinishHydration(() => {
        setHydrated(true);
      });
      if (useSahiStore.persist.hasHydrated()) {
        setHydrated(true);
      }
      timeout = setTimeout(() => setHydrated(true), 300);
      return () => {
        unsub();
        clearTimeout(timeout);
      };
    } else {
      setHydrated(true);
    }
  }, []);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: '#060B13', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
    );
  }

  const isReady = hasSeenWelcome && user?.isOnboarded;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isReady ? 'MainTabs' : 'Welcome'}
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#070D18',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 6,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
});
