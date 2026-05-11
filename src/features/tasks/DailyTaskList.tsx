import React from "react";
import { Pressable, View } from "react-native";
import { DailyTask } from "../../types/store";
import { AppCard } from "../../components/ui/AppCard";
import { AppText } from "../../components/ui/AppText";
import { Ionicons } from "@expo/vector-icons";
import { brand } from "../../theme/palettes";
import { i18n } from "../../i18n";

type Props = { tasks: DailyTask[]; onToggle: (id: string) => void };

export const DailyTaskList: React.FC<Props> = ({ tasks, onToggle }) => (
  <AppCard>
    <View className="flex-row items-center gap-2">
      <Ionicons name="checkbox-outline" size={18} color={brand.deepBlue} />
      <AppText variant="titleMd" numberOfLines={2}>
        {i18n.t("dashboard.tasks")}
      </AppText>
    </View>
    <View className="mt-3 gap-2">
      {tasks.map((task) => (
        <Pressable key={task.id} className="flex-row items-start gap-3" onPress={() => onToggle(task.id)}>
          <View
            className="h-5 w-5 rounded-full items-center justify-center border mt-0.5"
            style={{ backgroundColor: task.done ? brand.teal : "transparent", borderColor: brand.teal }}
          >
            {task.done ? <AppText variant="caption" className="text-white">✓</AppText> : null}
          </View>
          <AppText
            variant="bodyMd"
            className={`flex-1 ${task.done ? "line-through" : ""}`}
            color={task.done ? "textMuted" : "textDark"}
          >
            {task.label}
          </AppText>
        </Pressable>
      ))}
    </View>
  </AppCard>
);
