<template>
  <div>
    <h3 class="text-sm uppercase tracking-wide text-80 bg-30 p-3">
      {{ filter.name }}
    </h3>

    <div class="p-2 flex relative">
      <multiselect
        @input="handleChange"
        @close="handleClose"
        @remove="handleRemove"
        @open="handleOpen"
        track-by="value"
        label="label"
        :group-label="isOptionGroups ? 'label' : void 0"
        :group-values="isOptionGroups ? 'values' : void 0"
        :group-select="filter.groupSelect || false"
        ref="multiselect"
        :value="selected"
        :options="computedOptions"
        :placeholder="filter.placeholder || filter.name"
        :close-on-select="filter.max === 1"
        :clear-on-select="false"
        :multiple="isMultiselect"
        :max="filter.max || null"
        :optionsLimit="filter.optionsLimit || 1000"
        :limitText="count => __('novaMultiselectFilter.limitText', { count: String(count || '') })"
        :selectLabel="__('novaMultiselectFilter.selectLabel')"
        :selectGroupLabel="__('novaMultiselectFilter.selectGroupLabel')"
        :selectedLabel="__('novaMultiselectFilter.selectedLabel')"
        :deselectLabel="__('novaMultiselectFilter.deselectLabel')"
        :deselectGroupLabel="__('novaMultiselectFilter.deselectGroupLabel')"
      >
        <template slot="maxElements">
          {{ __('novaMultiselectFilter.maxElements', { max: String(filter.max || '') }) }}
        </template>

        <template slot="noResult">
          {{ __('novaMultiselectFilter.noResult') }}
        </template>

        <template slot="noOptions">
          {{ __('novaMultiselectFilter.noOptions') }}
        </template>
      </multiselect>
    </div>
  </div>
</template>

<script>
import HandlesFilterValue from '../mixins/HandlesFilterValue';
import Multiselect from 'vue-multiselect';
import { Filterable, InteractsWithQueryString } from 'laravel-nova';

export default {
  components: { Multiselect },
  mixins: [Filterable, InteractsWithQueryString, HandlesFilterValue],
  props: ['resourceName', 'resourceId', 'filterKey'],

  data: () => ({
    options: [],
    isDropdownOpen: false,
    selectedOptions: [],
    isTouched: false,
  }),

  methods: {
    handleChange(value) {
      if (!this.isMultiselect) value = [value];
      this.isTouched = true;
      this.selectedOptions = value;
    },

    handleClose() {
      this.isDropdownOpen = false;
      this.emitChanges();
    },

    handleOpen() {
      this.isDropdownOpen = true;
    },

    handleRemove() {
      // Resolve issue where handleRemove is called before handleChange
      this.$nextTick(() => {
        if (!this.isDropdownOpen) this.emitChanges();
      });
    },

    emitChanges() {
      //  Check if values have been changed
      if (JSON.stringify(this.value) === JSON.stringify(this.values) || this.values == null) return;

      // Update filter state
      this.$store.commit(`${this.resourceName}/updateFilterState`, {
        filterClass: this.filterKey,
        value: this.values,
      });

      // Reset selected options and is touched
      this.isTouched = false;
      this.selectedOptions = [];
      this.$emit('change');
    },
  },

  computed: {
    filter() {
      return this.$store.getters[`${this.resourceName}/getFilter`](this.filterKey);
    },

    value() {
      return this.filter.currentValue;
    },

    selected() {
      // If modified, return modified array
      if (this.isTouched) return this.selectedOptions;

      // Else return from $store
      const valuesArray = this.getInitialFilterValuesArray();
      return valuesArray && valuesArray.length ? valuesArray.map(this.getValueFromOptions).filter(Boolean) : [];
    },

    values() {
      if (!this.isTouched) return null;
      const values = [];

      // Return only values for query
      this.selectedOptions.forEach(option => {
        values.push(option.value);
      });

      return values.length ? values : '';
    },
  },
};
</script>
