interface ComponentOverride {
  label: string;
  component: string;
  types: string[];
}

export default class CalumaOptionsService {
  registerComponentOVerride(override: ComponentOverride): void;
  ungisterComponentOVerride(override: string | ComponentOverride): void;
  getComponentOverrides(): ComponentOverride[];
}
