import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { donumToM2 } from "../../lib/area";
import { defaultProject, useTarimStore } from "../../store/useTarimStore";
import { LandParcel, ProjectSummary, SoilTexture } from "../../types/store";
import { brand } from "../../theme/palettes";
import { AppButton } from "../ui/AppButton";
import { AppChip } from "../ui/AppChip";
import { AppText } from "../ui/AppText";
import { AppDivider } from "../ui/AppDivider";
import { i18n } from "../../i18n";

type Props = { visible: boolean; onClose: () => void };

const textures: SoilTexture[] = ["unknown", "clay", "loam", "sandy"];

function cloneProject(p: ProjectSummary): ProjectSummary {
  return JSON.parse(JSON.stringify(p)) as ProjectSummary;
}

export const LandSoilPlanModal: React.FC<Props> = ({ visible, onClose }) => {
  const project = useTarimStore((s) => s.project);
  const updateProject = useTarimStore((s) => s.updateProject);

  const [draft, setDraft] = useState<ProjectSummary>(() => cloneProject(project));
  const [pName, setPName] = useState("");
  const [pDonum, setPDonum] = useState("");
  const [pM2, setPM2] = useState("");

  useEffect(() => {
    if (visible) {
      setDraft(cloneProject(project));
      setPName("");
      setPDonum("");
      setPM2("");
    }
  }, [visible, project]);

  const setSoil = (partial: Partial<ProjectSummary["soil"]>) => {
    setDraft((d) => ({ ...d, soil: { ...d.soil, ...partial } }));
  };

  const syncPrimaryM2 = () => {
    const d = Math.max(0, Number(draft.areaDonums) || 0);
    setDraft((prev) => ({ ...prev, areaM2: donumToM2(d) }));
  };

  const save = () => {
    updateProject({
      name: draft.name.trim() || defaultProject.name,
      areaDonums: Math.max(0, Number(draft.areaDonums) || 0),
      areaM2: Math.max(0, Number(draft.areaM2) || 0),
      crop: draft.crop.trim() || defaultProject.crop,
      expectedHarvestYear: Math.max(1900, Math.round(Number(draft.expectedHarvestYear)) || new Date().getFullYear()),
      estimatedRevenue: Math.max(0, Number(draft.estimatedRevenue) || 0),
      plantingDateISO: draft.plantingDateISO?.trim() || null,
      soil: { ...draft.soil },
      parcels: draft.parcels,
    });
    onClose();
  };

  const addParcelFromInputs = () => {
    const name = pName.trim() || i18n.t("farm.parcelUnnamed");
    const don = Math.max(0, Number(pDonum.replace(",", ".")) || 0);
    const m2 = Math.max(0, Number(pM2.replace(",", ".")) || donumToM2(don));
    const next: LandParcel = { id: `${Date.now()}`, name, areaDonums: don, areaM2: m2 };
    setDraft((d) => ({ ...d, parcels: [...d.parcels, next] }));
    setPName("");
    setPDonum("");
    setPM2("");
  };

  const removeParcelLocal = (id: string) => {
    setDraft((d) => ({ ...d, parcels: d.parcels.filter((p) => p.id !== id) }));
  };

  const inputStyle = {
    borderColor: "rgba(57,255,142,0.35)",
    color: brand.textDark,
    backgroundColor: "rgba(255,255,255,0.04)",
  } as const;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-end bg-black/50"
      >
        <Pressable className="flex-1" onPress={onClose} />
        <View
          className="max-h-[92%] rounded-t-3xl px-5 pt-5 pb-4 border-t"
          style={{ backgroundColor: brand.nightBg, borderTopColor: "rgba(57,255,142,0.28)" }}
        >
          <View className="flex-row items-center justify-between mb-2">
            <AppText variant="titleLg" numberOfLines={2} className="flex-1 pr-2">
              {i18n.t("farm.modalTitle")}
            </AppText>
            <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button">
              <AppText variant="titleMd">
                ✕
              </AppText>
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <AppText variant="label" className="mb-1">
              {i18n.t("farm.projectName")}
            </AppText>
            <TextInput
              className="rounded-xl border px-3 py-3 mb-3"
              style={inputStyle}
              value={draft.name}
              onChangeText={(name) => setDraft((d) => ({ ...d, name }))}
              placeholder={i18n.t("farm.projectName")}
              placeholderTextColor={brand.textMuted}
            />

            <View className="flex-row gap-2 mb-3">
              <View className="flex-1">
                <AppText variant="label" className="mb-1">
                  {i18n.t("farm.donum")}
                </AppText>
                <TextInput
                  className="rounded-xl border px-3 py-3"
                  style={inputStyle}
                  keyboardType="decimal-pad"
                  value={String(draft.areaDonums)}
                  onChangeText={(t) => setDraft((d) => ({ ...d, areaDonums: Number(t.replace(",", ".")) || 0 }))}
                  placeholderTextColor={brand.textMuted}
                />
              </View>
              <View className="flex-1">
                <AppText variant="label" className="mb-1">
                  {i18n.t("farm.m2")}
                </AppText>
                <TextInput
                  className="rounded-xl border px-3 py-3"
                  style={inputStyle}
                  keyboardType="decimal-pad"
                  value={String(draft.areaM2)}
                  onChangeText={(t) => setDraft((d) => ({ ...d, areaM2: Number(t.replace(",", ".")) || 0 }))}
                  placeholderTextColor={brand.textMuted}
                />
              </View>
            </View>
            <AppButton title={i18n.t("farm.syncDonum")} variant="secondary" onPress={syncPrimaryM2} />

            <AppText variant="label" className="mb-1 mt-3">
              {i18n.t("farm.crop")}
            </AppText>
            <TextInput
              className="rounded-xl border px-3 py-3 mb-3"
              style={inputStyle}
              value={draft.crop}
              onChangeText={(crop) => setDraft((d) => ({ ...d, crop }))}
              placeholderTextColor={brand.textMuted}
            />

            <View className="flex-row gap-2 mb-3">
              <View className="flex-1">
                <AppText variant="label" className="mb-1">
                  {i18n.t("farm.harvestYear")}
                </AppText>
                <TextInput
                  className="rounded-xl border px-3 py-3"
                  style={inputStyle}
                  keyboardType="number-pad"
                  value={String(draft.expectedHarvestYear)}
                  onChangeText={(t) =>
                    setDraft((d) => ({ ...d, expectedHarvestYear: Math.round(Number(t)) || d.expectedHarvestYear }))
                  }
                  placeholderTextColor={brand.textMuted}
                />
              </View>
              <View className="flex-1">
                <AppText variant="label" className="mb-1">
                  {i18n.t("farm.revenue")}
                </AppText>
                <TextInput
                  className="rounded-xl border px-3 py-3"
                  style={inputStyle}
                  keyboardType="decimal-pad"
                  value={String(draft.estimatedRevenue)}
                  onChangeText={(t) =>
                    setDraft((d) => ({ ...d, estimatedRevenue: Number(t.replace(",", ".")) || 0 }))
                  }
                  placeholderTextColor={brand.textMuted}
                />
              </View>
            </View>

            <AppText variant="label" className="mb-1">
              {i18n.t("farm.plantingDate")}
            </AppText>
            <TextInput
              className="rounded-xl border px-3 py-3 mb-3"
              style={inputStyle}
              placeholder="2026-04-15"
              placeholderTextColor={brand.textMuted}
              value={draft.plantingDateISO ?? ""}
              onChangeText={(plantingDateISO) =>
                setDraft((d) => ({ ...d, plantingDateISO: plantingDateISO.trim() || null }))
              }
            />

            <AppDivider />
            <AppText variant="titleMd" className="mt-3 mb-2">
              {i18n.t("farm.soilSection")}
            </AppText>
            <View className="flex-row gap-2 mb-2">
              <View className="flex-1">
                <AppText variant="caption" className="mb-1">
                  {i18n.t("farm.soilPh")}
                </AppText>
                <TextInput
                  className="rounded-xl border px-3 py-2"
                  style={inputStyle}
                  placeholder="6.8"
                  placeholderTextColor={brand.textMuted}
                  value={draft.soil.ph}
                  onChangeText={(ph) => setSoil({ ph })}
                />
              </View>
              <View className="flex-1">
                <AppText variant="caption" className="mb-1">
                  {i18n.t("farm.soilOm")}
                </AppText>
                <TextInput
                  className="rounded-xl border px-3 py-2"
                  style={inputStyle}
                  placeholder="2.1"
                  placeholderTextColor={brand.textMuted}
                  value={draft.soil.organicMatterPct}
                  onChangeText={(organicMatterPct) => setSoil({ organicMatterPct })}
                />
              </View>
            </View>
            <AppText variant="caption" className="mb-1">
              {i18n.t("farm.soilTexture")}
            </AppText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
              <View className="flex-row gap-2">
                {textures.map((tx) => (
                  <AppChip
                    key={tx}
                    label={i18n.t(`farm.texture.${tx}`)}
                    selected={draft.soil.texture === tx}
                    textColor={brand.textDark}
                    selectedTextColor={brand.deepBlue}
                    onPress={() => setSoil({ texture: tx })}
                  />
                ))}
              </View>
            </ScrollView>
            <AppText variant="caption" className="mb-1">
              {i18n.t("farm.soilNotes")}
            </AppText>
            <TextInput
              className="rounded-xl border px-3 py-3 mb-4"
              style={inputStyle}
              placeholderTextColor={brand.textMuted}
              multiline
              maxLength={400}
              value={draft.soil.notes}
              onChangeText={(notes) => setSoil({ notes })}
            />

            <AppDivider />
            <AppText variant="titleMd" className="mt-3 mb-2">
              {i18n.t("farm.parcelsTitle")}
            </AppText>
            {draft.parcels.length === 0 ? (
              <AppText variant="bodyMd" className="mb-2" style={{ opacity: 0.72 }}>
                {i18n.t("farm.noParcels")}
              </AppText>
            ) : (
              <View className="gap-2 mb-3">
                {draft.parcels.map((parcel: LandParcel) => (
                  <View
                    key={parcel.id}
                    className="flex-row items-center justify-between rounded-xl border px-3 py-2"
                    style={{
                      borderColor: "rgba(57,255,142,0.35)",
                      backgroundColor: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <View className="flex-1 min-w-0 pr-2">
                      <AppText variant="titleMd" color="textDark" numberOfLines={1}>
                        {parcel.name}
                      </AppText>
                      <AppText variant="caption" color="textMuted" style={{ opacity: 0.9 }}>
                        {parcel.areaDonums} {i18n.t("farm.donumShort")} · {parcel.areaM2} m²
                      </AppText>
                    </View>
                    <Pressable onPress={() => removeParcelLocal(parcel.id)} accessibilityRole="button">
                      <AppText variant="bodyMd" color="error">
                        {i18n.t("farm.removeParcel")}
                      </AppText>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
            <AppText variant="caption" className="mb-1">
              {i18n.t("farm.addParcelHint")}
            </AppText>
            <TextInput
              className="rounded-xl border px-3 py-2 mb-2"
              style={inputStyle}
              placeholder={i18n.t("farm.parcelName")}
              placeholderTextColor={brand.textMuted}
              value={pName}
              onChangeText={setPName}
            />
            <View className="flex-row gap-2 mb-2">
              <TextInput
                className="flex-1 rounded-xl border px-3 py-2"
                style={inputStyle}
                placeholder={i18n.t("farm.donum")}
                placeholderTextColor={brand.textMuted}
                keyboardType="decimal-pad"
                value={pDonum}
                onChangeText={setPDonum}
              />
              <TextInput
                className="flex-1 rounded-xl border px-3 py-2"
                style={inputStyle}
                placeholder="m²"
                placeholderTextColor={brand.textMuted}
                keyboardType="decimal-pad"
                value={pM2}
                onChangeText={setPM2}
              />
            </View>
            <AppButton title={i18n.t("farm.addParcel")} variant="secondary" onPress={addParcelFromInputs} />

            <View className="h-6" />
            <AppButton title={i18n.t("modal.save")} onPress={save} />
            <View className="h-2" />
            <AppButton title={i18n.t("modal.cancel")} variant="secondary" onPress={onClose} />
            <View className="h-6" />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
