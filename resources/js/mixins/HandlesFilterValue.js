export default {
  data() {
    return {
      options: [],
    };
  },

  beforeMount() {
    this.options = this.filter.options || [];
  },

  methods: {
    getInitialFilterValuesArray() {
      return this.parseValuesArray(this.value);
    },

    parseValuesArray(value) {
      try {
        if (!value) return void 0;
        if (Array.isArray(value)) return value;

        // Attempt to parse the field value
        if (typeof value === 'string') {
          while (typeof value === 'string') value = JSON.parse(value);
          if (Array.isArray(value)) return value;
        }

        return void 0;
      } catch (e) {
        return void 0;
      }
    },

    matchesDependsOn(option) {
      if (!this.dependsOnValues.length) return true;

      const value = option[this.filter.dependsOn.attribute];
      return value === void 0 || value === null || this.dependsOnValues.includes(String(value));
    },

    getValueFromOptions(value) {
      let options = this.filter.options;

      if (this.isOptionGroups) {
        return this.filter.options
          .map(optGroup => optGroup.values.map(values => ({ ...values, group: optGroup.label })))
          .flat()
          .find(opt => String(opt.value) === String(value));
      }

      return options.find(opt => String(opt.value) === String(value));
    },
  },
  computed: {
    isOptionGroups() {
      return !!this.filter.options && !!this.filter.options.find(opt => opt.values && Array.isArray(opt.values));
    },

    isMultiselect() {
      return !this.filter.singleSelect;
    },

    dependsOnValues() {
      if (!this.filter.dependsOn) return [];

      const parent = this.$store.getters[`${this.resourceName}/getFilter`](this.filter.dependsOn.filter);
      if (!parent) return [];

      return (this.parseValuesArray(parent.currentValue) || []).map(String);
    },

    computedOptions() {
      let options = this.options || [];

      if (this.dependsOnValues.length) {
        options = this.isOptionGroups
          ? options
              .map(option => ({ ...option, values: option.values.filter(this.matchesDependsOn) }))
              .filter(option => option.values.length)
          : options.filter(this.matchesDependsOn);
      }

      if (this.isOptionGroups) {
        const allLabels = options.map(opt => opt.values.map(o => o.label)).flat();
        options = options.map(option => {
          return {
            ...option,
            values: option.values.map(opt => {
              const isDuplicate = allLabels.filter(l => l === opt.label).length > 1;
              return { ...opt, label: isDuplicate ? `${opt.label} (${option.label})` : opt.label };
            }),
          };
        });
      }

      return options;
    },
  },
};
