export type HealthComponent = {
  status: string;
};

export type HealthStatus = {
  status: string;
  components: {
    db?: HealthComponent;
    diskSpace?: HealthComponent;
    livenessState?: HealthComponent;
    ping?: HealthComponent;
    readinessState?: HealthComponent;
  };
  groups?: string[];
};