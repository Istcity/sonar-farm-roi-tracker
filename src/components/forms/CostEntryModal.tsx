import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { i18n } from "../../i18n";
import { useTarimStore } from "../../store/useTarimStore";
import { useThemeStore } from "../../store/useThemeStore";
import { brand } from "../../theme/palettes";
import { formatCategoryLabel } from "../../lib/formatters";
import { AppButton } from "../ui/AppButton";
import { AppChip } from "../ui/AppChip";
import { AppText } from "../ui/AppText";

type Props = { visible: boolean; onClose: () => void };
const customToken = "__custom__";

export const CostEntryModal: React.FC<Props> = ({ visible, onClose }) => {
  const categories = useTarimStore((s) => s.expenseCategories);
  const addCost = useTarimStore((s) => s.addCost);
  const addCustomExpenseCategory = useTarimStore((s) => s.addCustomExpenseCategory);
  const locale = useThemeStore((s) => s.locale);
  const isTR = locale.startsWith("tr");

  const [category, setCategory] = useState("gubre");
  const [custom, setCustom] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");

  const options = useMemo(() => [...categories, customToken], [categories]);
  const isValid = Number(amount) > 0 && (category !== customToken || custom.trim().length > 0);

  const handleSave = () => {
    const resolved = category === customToken ? custom.trim().toLowerCase() : category;
    if (!resolved) return;
    if (category === customToken) addCustomExpenseCategory(resolved);
    addCost({ category: resolved, amount: Number(amount), date, note: note || undefined });
    setAmount("");
    setCustom("");
    setNote("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-end bg-black/40"
      >
        <Pressable className="flex-1" onPress={onClose} />
        <View
          className="rounded-t-3xl p-6 border-t"
          style={{ backgroundColor: brand.nightBg, borderTopColor: "rgba(57,255,142,0.28)" }}
        >
          <View className="flex-row items-center justify-between">
            <AppText variant="titleLg">
              {i18n.t("modal.title")}
            </AppText>
            <Pressable onPress={onClose} hitSlop={10} accessibilityRole="button">
              <AppText variant="titleMd">
                ✕
              </AppText>
            </Pressable>
          </View>

          <AppText variant="label" className="mt-4 mb-2">
            {i18n.t("modal.category")}
          </AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {options.map((item) => (
                <AppChip
                  key={item}
                  label={item === customToken ? i18n.t("modal.customCategory") : formatCategoryLabel(item)}
                  selected={category === item}
                  textColor={brand.textDark}
                  selectedTextColor={brand.deepBlue}
                  onPress={() => setCategory(item)}
                />
              ))}
            </View>
          </ScrollView>
          {category === customToken ? (
            <TextInput
              className="mt-3 rounded-xl border px-3 py-3"
              style={{ borderColor: "rgba(57,255,142,0.35)", color: brand.textDark, backgroundColor: "rgba(255,255,255,0.04)" }}
              placeholder={isTR ? "Traktör bakımı" : "Tractor maintenance"}
              placeholderTextColor={brand.textMuted}
              value={custom}
              onChangeText={setCustom}
            />
          ) : null}

          <AppText variant="label" className="mt-4 mb-2">
            {i18n.t("modal.amount")}
          </AppText>
          <TextInput
            className="rounded-xl border px-3 py-3"
            style={{ borderColor: "rgba(57,255,142,0.35)", color: brand.textDark, backgroundColor: "rgba(255,255,255,0.04)" }}
            keyboardType="numeric"
            placeholder={isTR ? "₺" : "Amount"}
            placeholderTextColor={brand.textMuted}
            value={amount}
            onChangeText={setAmount}
          />

          <AppText variant="label" className="mt-4 mb-2">
            {i18n.t("modal.date")}
          </AppText>
          <TextInput
            className="rounded-xl border px-3 py-3"
            style={{ borderColor: "rgba(57,255,142,0.35)", color: brand.textDark, backgroundColor: "rgba(255,255,255,0.04)" }}
            value={date}
            onChangeText={setDate}
            placeholder={isTR ? "YYYY-AA-GG" : "YYYY-MM-DD"}
            placeholderTextColor={brand.textMuted}
          />

          <AppText variant="label" className="mt-4 mb-2">
            {i18n.t("modal.note")}
          </AppText>
          <TextInput
            className="rounded-xl border px-3 py-3"
            style={{ borderColor: "rgba(57,255,142,0.35)", color: brand.textDark, backgroundColor: "rgba(255,255,255,0.04)" }}
            value={note}
            onChangeText={setNote}
            multiline
            maxLength={100}
            placeholderTextColor={brand.textMuted}
          />

          <View className="mt-4 gap-2">
            <AppButton title={i18n.t("modal.save")} onPress={handleSave} disabled={!isValid} />
            <AppButton title={i18n.t("modal.cancel")} variant="secondary" onPress={onClose} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
