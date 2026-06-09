export type HealthComponent = {
  status: string;
  details?: Record<string, unknown>;
};

export type HealthStatus = {
  status: string;
  components?: {
    db?: HealthComponent;
    diskSpace?: HealthComponent;
    livenessState?: HealthComponent;
    ping?: HealthComponent;
    readinessState?: HealthComponent;
    [key: string]: HealthComponent | undefined;
  };
  groups?: string[];
};