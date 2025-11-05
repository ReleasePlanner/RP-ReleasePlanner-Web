export interface CommonDataItem {
  label: string;
  value: string;
  icon: string;
}

export interface CommonDataCardProps {
  owner: string;
  startDate: string;
  endDate: string;
  id: string;
}

export const COMMON_DATA_ICONS = {
  OWNER: "👤",
  START_DATE: "📅",
  END_DATE: "🏁",
  ID: "🆔",
} as const;

export const createCommonDataItems = (
  props: CommonDataCardProps
): CommonDataItem[] => [
  { label: "Owner", value: props.owner, icon: COMMON_DATA_ICONS.OWNER },
  {
    label: "Start",
    value: props.startDate,
    icon: COMMON_DATA_ICONS.START_DATE,
  },
  { label: "End", value: props.endDate, icon: COMMON_DATA_ICONS.END_DATE },
  { label: "ID", value: props.id, icon: COMMON_DATA_ICONS.ID },
];
