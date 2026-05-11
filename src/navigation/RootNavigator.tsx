import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { RootTabs } from "./RootTabs";
import { CropDetailScreen } from "../screens/crops/CropDetailScreen";

export type AppStackParamList = {
  Tabs: undefined;
  CropDetail: { cropId: string };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={RootTabs} />
      <Stack.Screen name="CropDetail" component={CropDetailScreen} />
    </Stack.Navigator>
  );
};
