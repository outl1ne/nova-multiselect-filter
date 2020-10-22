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
        getInitialFieldValuesArray() {
            try {
                if (!this.filter.currentValue) return void 0;
                if (Array.isArray(this.filter.currentValue)) return this.filter.currentValue;

                // Attempt to parse the field value
                if (typeof this.filter.currentValue === 'string') {
                    let value = this.filter.currentValue;
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

            if (this.filter.dependsOn) {
                const valueGroups = Object.values(this.filter.dependsOnOptions || {});
                options = [];
                valueGroups.forEach(values =>
                    Object.keys(values).forEach(value => options.push({ value, label: values[value] }))
                );
            }

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
        isMultiselect() {
            return !this.filter.singleSelect;
        },

        isOptionGroups() {
            return !!this.filter.options && !!this.filter.options.find(opt => opt.values && Array.isArray(opt.values));
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
