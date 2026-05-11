import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { DashboardScreen } from "../screens/dashboard/Dashboard";
import { CostsScreen } from "../screens/costs/Costs";
import { AboutScreen } from "../screens/about/About";
import { SettingsScreen } from "../screens/settings/Settings";
import { brand } from "../theme/palettes";
import { useThemeStore } from "../store/useThemeStore";
import { i18n } from "../i18n";

type RootTabParamList = {
  Dashboard: undefined;
  Costs: undefined;
  About: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootTabs() {
  // Subscribing to locale forces the tab labels to re-render on language change.
  const locale = useThemeStore((state) => state.locale);
  const isTR = locale.startsWith("tr");
  const settingsLabel = isTR ? "Ayarlar" : "Settings";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: brand.tealLight,
        tabBarInactiveTintColor: "#9DBBD2",
        tabBarStyle: {
          position: "absolute",
          left: 12,
          right: 12,
          bottom: 10,
          height: 66,
          paddingBottom: 8,
          borderTopColor: "rgba(94,234,212,0.32)",
          borderTopWidth: 1,
          backgroundColor: "rgba(8,24,39,0.95)",
          borderRadius: 24,
          shadowColor: brand.teal,
          shadowOpacity: 0.24,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 6 },
          elevation: 10,
        },
        tabBarLabelStyle: { fontFamily: "Inter_500Medium", fontSize: 11 },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={
              route.name === "Dashboard"
                ? focused
                  ? "leaf"
                  : "leaf-outline"
                : route.name === "Costs"
                  ? focused
                    ? "wallet"
                    : "wallet-outline"
                  : route.name === "Settings"
                    ? focused
                      ? "settings"
                      : "settings-outline"
                  : focused
                    ? "information-circle"
                    : "information-circle-outline"
            }
            size={focused ? size + 2 : size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: i18n.t("tabs.dashboard") }}
      />
      <Tab.Screen
        name="Costs"
        component={CostsScreen}
        options={{ title: i18n.t("tabs.costs") }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{ title: i18n.t("tabs.about") }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: settingsLabel }}
      />
    </Tab.Navigator>
  );
}
