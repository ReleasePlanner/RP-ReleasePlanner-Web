import { it, expect, describe } from "vitest";
import {
  createCommonDataItems,
  COMMON_DATA_ICONS,
  type CommonDataCardProps,
} from "./types";

describe("CommonDataCard types and utilities", () => {
  describe("COMMON_DATA_ICONS", () => {
    it("contains all required icons", () => {
      expect(COMMON_DATA_ICONS.OWNER).toBe("👤");
      expect(COMMON_DATA_ICONS.START_DATE).toBe("📅");
      expect(COMMON_DATA_ICONS.END_DATE).toBe("🏁");
      expect(COMMON_DATA_ICONS.ID).toBe("🆔");
    });
  });

  describe("createCommonDataItems", () => {
    it("creates correct data items from props", () => {
      const props: CommonDataCardProps = {
        owner: "Alice",
        startDate: "2025-01-01",
        endDate: "2025-01-31",
        id: "p1",
      };

      const result = createCommonDataItems(props);

      expect(result).toHaveLength(4);
      expect(result[0]).toEqual({
        label: "Owner",
        value: "Alice",
        icon: "👤",
      });
      expect(result[1]).toEqual({
        label: "Start",
        value: "2025-01-01",
        icon: "📅",
      });
      expect(result[2]).toEqual({
        label: "End",
        value: "2025-01-31",
        icon: "🏁",
      });
      expect(result[3]).toEqual({
        label: "ID",
        value: "p1",
        icon: "🆔",
      });
    });
  });
});
