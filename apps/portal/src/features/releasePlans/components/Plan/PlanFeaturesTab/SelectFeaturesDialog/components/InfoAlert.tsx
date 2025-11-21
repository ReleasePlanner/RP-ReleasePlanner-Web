import { Alert } from "@mui/material";

export type InfoAlertProps = {
  readonly hasProduct: boolean;
};

export function InfoAlert({ hasProduct }: InfoAlertProps) {
  return (
    <Alert
      severity="info"
      sx={{
        m: 1.5,
        mb: 1,
        mt: hasProduct ? 1 : 1.5,
        borderRadius: 1.5,
        "& .MuiAlert-message": {
          fontSize: "0.6875rem",
          lineHeight: 1.5,
        },
        "& .MuiAlert-icon": {
          fontSize: "1rem",
        },
      }}
    >
      Only features with <strong>Completed</strong> status can be added to the
      release plan. Features that are already in other active plans (not
      closed) are not available to add.
    </Alert>
  );
}

