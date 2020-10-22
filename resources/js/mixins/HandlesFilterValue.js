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

            if (this.isOptionGroups) {
                return this.filter.options
                    .map(optGroup => optGroup.values.map(values => ({...values, group: optGroup.label})))
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
    },
};
