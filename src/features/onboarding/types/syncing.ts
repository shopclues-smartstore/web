export type SyncStepStatus = "pending" | "active" | "done";

export interface SyncStep {
  id: string;
  label: string;
  icon: React.ElementType;
  status: SyncStepStatus;
}
