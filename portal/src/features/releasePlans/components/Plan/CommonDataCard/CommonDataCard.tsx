import React, { useState } from "react";
import { Card, CardContent, Tabs, Tab, Box } from "@mui/material";
import type { CommonDataCardProps } from "./types";

import { a11yProps } from "./utils/tabUtils";
import { TabPanel } from "./components/TabPanel";
import { ProductSelector } from "./components/ProductSelector";
import { CommonDataPanel } from "./components/CommonDataPanel";
import { ComponentsPanel } from "./components/ComponentsPanel";
import { FeaturesPanel } from "./components/FeaturesPanel";
import { useProductSelection } from "./hooks/useProductSelection";
import { useViewMode } from "./hooks/useViewMode";

export default function CommonDataCard(_: CommonDataCardProps) {
  const [activeTab, setActiveTab] = useState<number>(0);

  const { products, selectedProductId, handleProductChange } = useProductSelection();
  const { viewMode, setViewMode } = useViewMode("grid");

  return (
    <Card>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} aria-label="Common data tabs">
            <Tab label="Common Data" {...a11yProps(0)} />
            <Tab label="Components" {...a11yProps(1)} />
            <Tab label="Features" {...a11yProps(2)} />
          </Tabs>

          <ProductSelector selectedProduct={selectedProductId} products={products} onProductChange={handleProductChange} />
        </Box>

        <TabPanel value={activeTab} index={0}>
          <CommonDataPanel />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <ComponentsPanel selectedProduct={selectedProductId} viewMode={viewMode} onViewModeChange={setViewMode} />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <FeaturesPanel selectedProduct={selectedProductId} viewMode={viewMode} onViewModeChange={setViewMode} />
        </TabPanel>
      </CardContent>
    </Card>
  );
}

          onChange={handleChange}
          label="Select Product"
          displayEmpty
          MenuProps={{
            PaperProps: {
              sx: {
                boxShadow: theme.shadows[3],
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                mt: 0.5,
                "& .MuiMenuItem-root": {
                  fontSize: "0.875rem",
                  py: 1,
                  px: 2,
                  transition: theme.transitions.create(["background-color"], {
                    duration: theme.transitions.duration.shorter,
                  }),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                  "&.Mui-selected": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    },
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="" disabled>
            <em>Select a product...</em>
          </MenuItem>
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  py: 0.5,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, fontSize: "0.875rem" }}
                >
                  {product.name}
                </Typography>
                {product.description && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem", mt: 0.25 }}
                  >
                    {product.description}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  color="primary.main"
                  sx={{ fontSize: "0.7rem", mt: 0.25, fontStyle: "italic" }}
                >
                  Components: {product.components.join(", ")}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

function DataRow({ icon, label, value, isStatus = false }: DataRowProps) {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "planned":
        return {
          color: theme.palette.info.main,
          bg: alpha(theme.palette.info.main, 0.08),
        };
      case "in_progress":
      case "active":
        return {
          color: theme.palette.primary.main,
          bg: alpha(theme.palette.primary.main, 0.08),
        };
      case "done":
      case "completed":
        return {
          color: theme.palette.success.main,
          bg: alpha(theme.palette.success.main, 0.08),
        };
      case "paused":
      case "on_hold":
        return {
          color: theme.palette.warning.main,
          bg: alpha(theme.palette.warning.main, 0.08),
        };
      default:
        return {
          color: theme.palette.text.secondary,
          bg: alpha(theme.palette.grey[500], 0.08),
        };
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        py: 1.5,
        px: 0,
        minHeight: 40,
        transition: theme.transitions.create(["background-color"], {
          duration: theme.transitions.duration.shorter,
        }),
      }}
    >
      {/* Icon Container */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 1,
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          color: theme.palette.primary.main,
          mr: 2,
          flexShrink: 0,
          "& .MuiSvgIcon-root": {
            fontSize: 18,
          },
        }}
      >
        {icon}
      </Box>

      {/* Label */}
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          fontWeight: 500,
          fontSize: "0.875rem",
          lineHeight: 1.4,
          minWidth: 80,
          mr: 2,
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>

      {/* Value */}
      {isStatus ? (
        <Chip
          label={value}
          size="small"
          sx={{
            height: 24,
            fontSize: "0.75rem",
            fontWeight: 500,
            ...getStatusColor(value),
            backgroundColor: getStatusColor(value).bg,
            color: getStatusColor(value).color,
            border: "none",
            textTransform: "capitalize",
          }}
        />
      ) : (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 400,
            fontSize: "0.875rem",
            lineHeight: 1.4,
            flex: 1,
            wordBreak: "break-word",
          }}
        >
          {value || "—"}
        </Typography>
      )}
    </Box>
  );
}

export default function CommonDataCard({
  owner,
  startDate,
  endDate,
  id,
  selectedProduct,
  products = [],
  onProductChange,
}: CommonDataCardProps) {
  // The legacy, large implementation that used to live here was removed in favor of
  // the compact, component-composed implementation at the top of this file.
  // This spot intentionally left blank to avoid duplicated exports.
          pt: 3,
          pb: 0,
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 600,
            fontSize: "1.125rem",
            lineHeight: 1.3,
            color: theme.palette.text.primary,
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FolderOpen
            sx={{ fontSize: 20, color: theme.palette.primary.main }}
          />
          Plan Data
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="plan data tabs"
          sx={{
            minHeight: 40,
            "& .MuiTab-root": {
              minHeight: 40,
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              px: 2,
              py: 1,
              transition: theme.transitions.create(
                ["color", "background-color"],
                {
                  duration: theme.transitions.duration.short,
                }
              ),
              "&.Mui-selected": {
                color: theme.palette.primary.main,
              },
            },
            "& .MuiTabs-indicator": {
              height: 2,
              borderRadius: 1,
            },
          }}
        >
          <Tab label="Common Data" {...a11yProps(0)} />
          <Tab label="Components" {...a11yProps(1)} />
          <Tab label="Features" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        {/* Tab Panel 1: Common Data */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <DataRow
              icon={<PersonOutline />}
              label="Owner"
              value={owner || "—"}
            />

            <Divider sx={{ my: 1, opacity: 0.6 }} />

            <DataRow
              icon={<CalendarToday />}
              label="Duration"
              value={dateRange}
            />

            <Divider sx={{ my: 1, opacity: 0.6 }} />

            {/* Product Selector */}
            {onProductChange && (
              <>
                <ProductSelector
                  selectedProduct={selectedProduct}
                  products={products}
                  onProductChange={onProductChange}
                />

                <Divider sx={{ my: 1, opacity: 0.6 }} />
              </>
            )}

            <DataRow icon={<Schedule />} label="ID" value={id || "—"} />
          </Box>
        </TabPanel>

        {/* Tab Panel 2: Components */}
        <TabPanel value={activeTab} index={1}>
          <ComponentsPanel
            selectedProduct={selectedProduct}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
        </TabPanel>

        {/* Tab Panel 3: Features */}
        <TabPanel value={activeTab} index={2}>
          <FeaturesPanel
            selectedProduct={selectedProduct}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
        </TabPanel>
      </CardContent>
    </Card>
  );
}
