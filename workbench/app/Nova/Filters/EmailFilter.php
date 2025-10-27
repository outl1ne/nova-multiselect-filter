<?php

namespace Workbench\App\Nova\Filters;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Laravel\Nova\Filters\Filter;
use Laravel\Nova\Http\Requests\NovaRequest;

class EmailFilter extends Filter
{
    /**
     * The filter's component.
     *
     * @var string
     */
    public $component = 'nova-multiselect-filter';

    /**
     * Apply the filter to the given query.
     */
    public function apply(NovaRequest $request, Builder $query, mixed $value): Builder
    {
        return $query->where(function ($q) use ($value) {
            foreach ($value as $domain) {
                $q->orWhere('email', 'like', '%'.$domain);
            }
        });
    }

    /**
     * Get the filter's available options.
     *
     * @return array<string, string>
     */
    public function options(NovaRequest $request): array
    {
        return [
            'example.com' => 'example.com',
            'example.org' => 'example.org',
            'example.net' => 'example.net',
            'example.ee' => 'example.ee',
            'example.fr' => 'example.fr',
            'example.us' => 'example.us',
            'example.co.uk' => 'example.co.uk',
            'example.tv' => 'example.tv',
        ];
    }
}
