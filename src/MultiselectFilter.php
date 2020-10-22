<?php

namespace OptimistDigtal\NovaMultiselectFilter;

use Illuminate\Container\Container;
use Illuminate\Http\Request;
use Laravel\Nova\Filters\Filter;

abstract class MultiselectFilter extends Filter
{
    public $component = 'nova-multiselect-filter-2';
    public $groupSelect = false;

    /**
     * Apply the filter to the given query.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param mixed $value
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function apply(Request $request, $query, $value)
    {
        return $query;
    }

    /**
     * Get the filter's available options.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function options(Request $request)
    {
        return [];
    }

    public function placeholder()
    {
        return null;
    }

    public function groupSelect()
    {
        return $this->groupSelect;
    }

    public function getAvailableOptions()
    {
        $container = Container::getInstance();

        if (is_callable($this->options($container->make(Request::class)))) $options = call_user_func($this->options($container->make(Request::class)));
        $options = collect($this->options($container->make(Request::class)) ?? []);

        $isOptionGroup = $options->contains(function ($label, $value) {
            return is_array($label);
        });

        if ($isOptionGroup) {
            $_options = $options
                ->map(function ($value, $key) {
                    return collect($value + ['value' => $key]);
                })
                ->groupBy('group')
                ->map(function ($value, $key) {
                    return ['label' => $key, 'values' => $value->map->only(['label', 'value'])->toArray()];
                })
                ->values()
                ->toArray();

            return $_options;
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
    public function jsonSerialize()
    {
        return array_merge([
            'class' => $this->key(),
            'name' => $this->name(),
            'component' => $this->component(),
            'options' => $this->getAvailableOptions(),
            'currentValue' => $this->default() ?? '',
            'groupSelect' => $this->groupSelect(),
            'placeholder' => $this->placeholder(),
        ], $this->meta());
    }
}
