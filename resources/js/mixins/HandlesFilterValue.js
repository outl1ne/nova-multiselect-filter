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
      try {
        if (!this.value) return void 0;
        if (Array.isArray(this.value)) return this.value;

        // Attempt to parse the field value
        if (typeof this.value === 'string') {
          let value = this.value;
          while (typeof value === 'string') value = JSON.parse(value);
          if (Array.isArray(value)) return value;
        }

        return void 0;
      } catch (e) {
        return void 0;
      }
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

    computedOptions() {
      let options = this.options || [];

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
