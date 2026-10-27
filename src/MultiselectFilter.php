<?php

namespace Outl1ne\NovaMultiselectFilter;

use Illuminate\Container\Container;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Laravel\Nova\Filters\Filter;
use Laravel\Nova\Http\Requests\NovaRequest;

abstract class MultiselectFilter extends Filter
{
    public $component = 'nova-multiselect-filter';

    /**
     * Apply the filter to the given query.
     *
     * @param Request $request
     * @param Builder $query
     * @param $value
     * @return Builder
     */
    public function apply(NovaRequest $request, Builder $query, mixed $value): Builder
    {
        return $query;
    }

    /**
     * Get the filter's options.
     *
     * @param Request $request
     * @return array|callable
     */
    public function options(NovaRequest $request)
    {
        return [];
    }

    /**
     * Sets the placeholder value displayed on the field.
     *
     * @param $placeholder
     * @return MultiselectFilter
     */
    public function placeholder($placeholder)
    {
        return $this->withMeta(['placeholder' => $placeholder]);
    }

    /**
     * Sets the max number of options the user can select.
     *
     * @param $placeholder
     * @return MultiselectFilter
     */
    public function max($max)
    {
        return $this->withMeta(['max' => $max]);
    }

    /**
     * Enables the field to be used as a single select.
     *
     * This forces the value saved to be a single value and not an array.
     *
     * @param bool $singleSelect
     * @return MultiselectFilter
     **/
    public function singleSelect($singleSelect = true)
    {
        return $this->withMeta(['singleSelect' => $singleSelect]);
    }

    /**
     * Sets the maximum number of options displayed at once.
     *
     * @param $optionsLimit
     * @return MultiselectFilter
     */
    public function optionsLimit($optionsLimit)
    {
        return $this->withMeta(['optionsLimit' => $optionsLimit]);
    }

    /**
     * Sets the maximum height of the options dropdown in pixels.
     *
     * @param $maxHeight
     * @return MultiselectFilter
     */
    public function maxHeight($maxHeight)
    {
        return $this->withMeta(['maxHeight' => $maxHeight]);
    }

    /**
     * Enables vue-multiselect's group-select feature which allows the
     * user to select the whole group at once.
     *
     * @param bool $groupSelect
     * @return MultiselectFilter
     */
    public function groupSelect($groupSelect = true)
    {
        return $this->withMeta(['groupSelect' => $groupSelect]);
    }

    /**
     * Shows only the options whose attribute matches a value selected in another filter.
     * Options without the attribute are always shown.
     *
     * @param string|Filter $filter The parent filter or its class name
     * @param string $attribute The option key that holds the parent filter's value
     * @return MultiselectFilter
     */
    public function dependsOn($filter, $attribute)
    {
        return $this->withMeta(['dependsOn' => [
            'filter' => $filter instanceof Filter ? $filter->key() : $filter,
            'attribute' => $attribute,
        ]]);
    }

    /**
     * Formats the options available for select.
     *
     * @param $container
     * @param $request
     * @return array
     */
    public function getFormattedOptions($container, $request)
    {
        $options = $this->options($container->make($request));
        $options = collect($options ?? []);

        $isOptionGroup = $options->contains(function ($label, $value) {
            return is_array($label);
        });

        if ($isOptionGroup) {
            $keys = array_filter(['label', 'value', $this->meta['dependsOn']['attribute'] ?? null]);

            return $options
                ->map(function ($value, $key) {
                    return collect($value + ['value' => $key]);
                })
                ->groupBy('group')
                ->map(function ($value, $key) use ($keys) {
                    return ['label' => $key, 'values' => $value->map->only($keys)->toArray()];
                })
                ->values()
                ->toArray();
        }

        return $options->map(function ($label, $value) {
            return ['label' => $label, 'value' => $value];
        })->values()->all();
    }

    /**
     * Prepare the filter for JSON serialization.
     *
     * @return array
     */
    public function jsonSerialize(): array
    {
        return array_merge([
            'class' => $this->key(),
            'name' => $this->name(),
            'component' => $this->component(),
            'options' => $this->getFormattedOptions(Container::getInstance(), NovaRequest::class),
            'currentValue' => $this->default() ?? '',
        ], $this->meta());
    }
}
