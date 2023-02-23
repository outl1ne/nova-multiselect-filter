<template>
  <div class="outl1ne-multiselect-filter o1-pt-2 o1-pb-3 o1-relative">
    <h3 class="o1-px-3 o1-text-xs o1-uppercase o1-font-bold o1-tracking-wide">
      <span>{{ filter.name }}</span>
    </h3>

    <div class="o1-pt-2 o1-px-2 o1-flex o1-relative">
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
        :close-on-select="filter.max === 1 || !isMultiselect"
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
        <template #maxElements>
          {{ __('novaMultiselectFilter.maxElements', { max: String(filter.max || '') }) }}
        </template>

        <template #noResult>
          {{ __('novaMultiselectFilter.noResult') }}
        </template>

        <template #noOptions>
          {{ __('novaMultiselectFilter.noOptions') }}
        </template>

        <template #singleLabel="{ option }">
          <span>{{ option ? option.label : '' }}</span>
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
    hasRemoved: false,
    selectedOptions: [],
    isTouched: false,
  }),

  mounted() {
    window.addEventListener('scroll', this.repositionDropdown);

    const fc = this.findFiltersContainer();
    if (fc) fc.addEventListener('scroll', this.repositionDropdown);
  },

  unmounted() {
    window.removeEventListener('scroll', this.repositionDropdown);

    const fc = this.findFiltersContainer();
    if (fc) fc.removeEventListener('scroll', this.repositionDropdown);
  },

  methods: {
    handleChange(value) {
      // For some reason, after upgrading to Vue 3, this callback
      // Sometimes receives an InputEvent as an argument - my only
      // fix is to filter out the InputEvent and only accept arrays
      if (this.isMultiselect) {
        if (!Array.isArray(value)) return;
      } else {
        if (value && !value.value) return;
      }

      this.isTouched = true;
      this.selectedOptions = this.isMultiselect ? value : [value];

      this.$nextTick(this.repositionDropdown);

      if (this.hasRemoved) {
        this.hasRemoved = false;
        this.emitChanges();
      }
    },

    handleClose() {
      this.isDropdownOpen = false;
      this.emitChanges();
    },

    handleOpen() {
      this.isDropdownOpen = true;
      this.$nextTick(this.repositionDropdown);
    },

    handleRemove() {
      this.hasRemoved = true;
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

    repositionDropdown(onOpen = false) {
      const ms = this.$refs.multiselect;
      if (!ms) return;

      const el = ms.$el;
      const parentContainer = this.findFiltersContainer();
      if (!parentContainer) return;

      const handlePositioning = () => {
        if (onOpen) ms.$refs.list.scrollTop = 0;

        let parentScrollTop = parentContainer.scrollTop;

        const top =
          el.parentElement.parentElement.offsetTop +
          el.clientHeight +
          el.parentElement.offsetTop -
          parentScrollTop +
          el.offsetTop;

        ms.$refs.list.style.position = 'fixed';
        ms.$refs.list.style.width = `${el.clientWidth}px`;
        ms.$refs.list.style.top = `${top}px`;
        ms.$refs.list.style['border-radius'] = '0 0 5px 5px';
      };

      if (onOpen) this.$nextTick(handlePositioning);
      else handlePositioning();
    },

    findFiltersContainer() {
      const ms = this.$refs.multiselect;
      if (!ms) return;

      let el = ms.$el;
      while (el) {
        if (el.classList.contains('scroll-wrap')) return el;
        el = el.parentElement;
      }
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
      if (this.isTouched) {
        return this.isMultiselect ? this.selectedOptions : this.selectedOptions[0];
      }

      // Else return from $store
      const valuesArray = this.getInitialFilterValuesArray();

      if (this.isMultiselect) {
        return valuesArray && valuesArray.length ? valuesArray.map(this.getValueFromOptions).filter(Boolean) : [];
      }

      return valuesArray && valuesArray.length ? this.getValueFromOptions(valuesArray[0]) : void 0;
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
$white: #fff;
$slate50: #f8fafc;
$slate100: #f1f5f9;
$slate200: #e2e8f0;
$slate300: #cbd5e1;
$slate400: #94a3b8;
$slate500: #64748b;
$slate600: #475569;
$slate700: #334155;
$slate800: #1e293b;
$slate900: #0f172a;

$red400: #f87171;
$red500: #ef4444;

.outl1ne-multiselect-filter {
  .multiselect {
    min-height: 36px;
    border: none;
    border-radius: 0;
    background: none;
  }

  .multiselect__tags {
    --tw-border-opacity: 1;
    border-width: 1px;

    border-color: $slate300;
    background-color: $white;
    color: $slate600;

    padding: 6px 56px 0 6px;
    min-height: 36px;

    border-radius: 4px;
    overflow: hidden;

    .dark & {
      border-color: $slate700;
      background-color: $slate900;
      color: $slate400;
    }
  }

  .multiselect__input {
    border: none;
    border-color: rgba(var(--colors-gray-100), var(--tw-border-opacity));
    background-color: $white;
    color: rgba(var(--colors-gray-400));

    font-size: 14px;
    line-height: 14px;

    padding-left: 8px;

    .dark & {
      background-color: $slate900;
      color: $slate400;
    }
  }

  .multiselect__tag {
    background-color: rgba(var(--colors-primary-500));
    color: $white;
    font-weight: 600;

    /* .dark & {
      color: rgba(var(--colors-gray-900), var(--tw-text-opacity));
    } */

    padding: 4px 24px 4px 8px;
    margin: 1px 8px 1px 0;

    .multiselect__tag-icon {
      &::after {
        color: $white;
      }

      &:hover {
        background: rgba(var(--colors-primary-500));

        &::after {
          color: $red500;
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
    background-color: $white;
    color: $slate600;

    font-size: 14px;
    line-height: 18px;
    font-weight: 700;
    min-height: 18px;

    padding-top: 2px;
    padding-left: 8px;

    color: $slate600;

    .dark & {
      color: rgba(var(--colors-gray-400));
      background-color: $slate900;
    }
  }

  .multiselect__spinner {
    background-color: $white;
    color: $slate600;

    .dark & {
      background-color: $slate900;
      color: $slate400;
    }

    &:before,
    &:after {
      border-color: rgba(var(--colors-primary-500)) transparent transparent;
    }
  }

  .multiselect__content-wrapper {
    border-color: $slate300;
    transition: none;

    .multiselect__content {
      overflow: hidden;
      width: 100%;
    }

    .dark & {
      border-color: $slate700;
    }

    li > span.multiselect__option {
      background-color: #fff;
      color: $slate400;

      min-height: 32px;
      font-size: 14px;
      line-height: 14px;

      .dark & {
        background-color: $slate900;
      }
    }

    .multiselect__element {
      background-color: $white;
      color: $slate600;

      .dark & {
        background-color: $slate900;
        color: $slate400;
      }

      .multiselect__option {
        color: $slate600;

        padding: 8px 12px;
        min-height: 32px;
        font-size: 14px;
        line-height: 14px;

        .dark & {
          color: $slate400;

          &--disabled {
            color: $slate500 !important;
            background-color: $slate800 !important;
            opacity: 0.9;
          }
        }

        &.multiselect__option--selected {
          color: rgba(var(--colors-primary-500));
          background-color: $white;

          .dark & {
            background-color: $slate900;
          }
        }

        &.multiselect__option--highlight {
          background-color: rgba(var(--colors-primary-500));
          color: $white;

          &::after {
            background-color: rgba(var(--colors-primary-500));
            font-weight: 600;
          }

          &.multiselect__option--selected {
            background-color: $red400;

            .dark & {
              background-color: $red400;
            }
          }
        }
      }
    }
  }

  .reorder__tag {
    background-color: rgba(var(--colors-primary-500));
    border-radius: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 5px;
    font-weight: 600;
    transition: all 0.2s ease-in-out;

    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }

  .multiselect__select {
    height: 36px;
  }

  .multiselect__placeholder {
    margin-bottom: 8px;
    padding-top: 0px;
    padding-left: 8px;
    min-height: 16px;
    line-height: 16px;
    cursor: default;

    color: #475569;

    .dark & {
      color: #64748b;
    }
  }

  .multiselect__clear {
    position: absolute;
    right: 36px;
    top: 8px;
    height: 20px;
    width: 20px;
    display: block;
    cursor: pointer;
    z-index: 2;

    &::before,
    &::after {
      content: '';
      display: block;
      position: absolute;
      width: 3px;
      height: 16px;
      background: #aaa;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      margin: auto;
    }

    &::before {
      transform: rotate(45deg);
    }

    &::after {
      transform: rotate(-45deg);
    }
  }
}
</style>
