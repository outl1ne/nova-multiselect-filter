<template>
  <div class="nova-multiselect-filter">
    <h3 class="px-3 text-xs uppercase font-bold tracking-wide">
      <span>{{ filter.name }}</span>
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
        :optionHeight="32"
        :limitText="count => __('novaMultiselectFilter.limitText', { count: String(count || '') })"
        selectLabel=""
        selectGroupLabel=""
        selectedLabel=""
        deselectLabel=""
        deselectGroupLabel=""
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
import Multiselect from 'vue-multiselect/src/Multiselect';
import Filterable from 'laravel-nova-filterable';
import InteractsWithQueryString from 'laravel-nova-interacts-with-query-string';

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
      if (!this.isMultiselect) value = value ? [value] : [];
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

<style lang="scss">
@import '~vue-multiselect/dist/vue-multiselect.min.css';

.nova-multiselect-filter {
  margin-top: 0.25rem;
  padding-top: 0.5rem;
  padding-bottom: 0.25rem;

  .multiselect {
    min-height: 32px;

    &.multiselect--active {
      > .multiselect__select {
        width: 32px;
      }
    }

    > .multiselect__select {
      width: 32px;
      height: 32px;
    }
  }

  .multiselect__tags {
    --tw-border-opacity: 1;
    border-width: 1px;
    border-color: rgba(var(--colors-gray-300), var(--tw-border-opacity));
    background-color: rgba(var(--colors-white), var(--tw-bg-opacity));
    color: rgba(var(--colors-gray-600), var(--tw-text-opacity));
    .dark & {
      border-color: rgba(var(--colors-gray-700), var(--tw-border-opacity));
      background-color: rgba(var(--colors-gray-900), var(--tw-bg-opacity));
      color: rgba(var(--colors-gray-400), var(--tw-text-opacity));
    }
  }
  .multiselect__input {
    border: none;
    background-color: rgba(var(--colors-white), var(--tw-bg-opacity));
    color: rgba(var(--colors-gray-600), var(--tw-text-opacity));
    .dark & {
      background-color: rgba(var(--colors-gray-900), var(--tw-bg-opacity));
      color: rgba(var(--colors-gray-400), var(--tw-text-opacity));
    }
  }
  .multiselect__tag {
    background-color: rgba(var(--colors-primary-500));
    color: rgba(var(--colors-white), var(--tw-text-opacity));
    --tw-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    font-weight: 700;
    /* .dark & {
      color: rgba(var(--colors-gray-800), var(--tw-text-opacity));
    } */
    .multiselect__tag-icon {
      &::after {
        color: rgba(var(--colors-white));
      }
      &:hover {
        background: rgba(var(--colors-primary-400));
        &::after {
          color: rgba(var(--colors-red-500));
        }
      }
    }
  }
  .multiselect > .multiselect__clear {
    &::before,
    &::after {
      width: 2px;
      background: rgba(var(--colors-gray-400));
    }
    &:hover {
      &::before,
      &::after {
        background: rgba(var(--colors-red-400));
      }
    }
  }
  .multiselect__single {
    background-color: rgba(var(--colors-white), var(--tw-bg-opacity));
    color: rgba(var(--colors-gray-600), var(--tw-text-opacity));
    .dark & {
      background-color: rgba(var(--colors-gray-900), var(--tw-bg-opacity));
      color: rgba(var(--colors-gray-400), var(--tw-text-opacity));
    }
  }
  .multiselect__spinner {
    background-color: rgba(var(--colors-white), var(--tw-bg-opacity));
    color: rgba(var(--colors-gray-600), var(--tw-text-opacity));
    .dark & {
      background-color: rgba(var(--colors-gray-900), var(--tw-bg-opacity));
      color: rgba(var(--colors-gray-400), var(--tw-text-opacity));
    }
    &:before,
    &:after {
      border-color: rgba(var(--colors-primary-500)) transparent transparent;
    }
  }
  .multiselect__content-wrapper {
    border-color: rgba(var(--colors-gray-300), var(--tw-border-opacity));
    .dark & {
      border-color: rgba(var(--colors-gray-700), var(--tw-border-opacity));
    }

    .multiselect__content {
      width: 240px;
    }

    li > span.multiselect__option {
      background-color: #fff;
      color: rgba(var(--colors-gray-400));
      .dark & {
        background-color: rgba(var(--colors-gray-900));
      }
    }
    .multiselect__element {
      background-color: rgba(var(--colors-white), var(--tw-bg-opacity));
      color: rgba(var(--colors-gray-600), var(--tw-text-opacity));
      .dark & {
        background-color: rgba(var(--colors-gray-900), var(--tw-bg-opacity));
        color: rgba(var(--colors-gray-400), var(--tw-text-opacity));
      }
      .multiselect__option {
        color: rgba(var(--colors-gray-600));
        .dark & {
          color: rgba(var(--colors-gray-400));
        }
        &.multiselect__option--selected {
          color: rgba(var(--colors-primary-400));
          background-color: rgba(var(--colors-white));
          .dark & {
            background-color: rgba(var(--colors-gray-900));
          }
        }

        &.multiselect__option--group {
          color: rgba(var(--colors-gray-500))!important;
          background-color: rgba(var(--colors-gray-100))!important;

          .dark & {
            color: rgba(var(--colors-gray-500))!important;
            background-color: rgba(var(--colors-gray-900))!important;
          }
        }

        &.multiselect__option--highlight {
          background-color: rgba(var(--colors-primary-500));
          color: rgba(var(--colors-white));
          &::after {
            background-color: rgba(var(--colors-primary-500));
            font-weight: 700;
          }
          &.multiselect__option--selected {
            background-color: rgba(var(--colors-red-500));
            .dark & {
              background-color: rgba(var(--colors-red-500));
            }
          }
        }
      }
    }
  }
}
</style>
