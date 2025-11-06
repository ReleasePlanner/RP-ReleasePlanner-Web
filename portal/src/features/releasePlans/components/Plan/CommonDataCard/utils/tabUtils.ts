export function a11yProps(index: number) {
  return {
    id: `common-data-tab-${index}`,
    "aria-controls": `common-data-tabpanel-${index}`,
  };
}
