<?php

namespace Outl1ne\NovaMultiselectFilter;

use Laravel\Nova\Nova;
use Laravel\Nova\Events\ServingNova;
use Illuminate\Support\ServiceProvider;
use Outl1ne\NovaTranslationsLoader\LoadsNovaTranslations;

class FilterServiceProvider extends ServiceProvider
{
    use LoadsNovaTranslations;
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot(): void
    {
        Nova::serving(function (ServingNova $event): void {
            Nova::script('nova-multiselect-filter', __DIR__ . '/../dist/js/filter.js');
        });

        $this->loadTranslations(__DIR__ . '/../resources/lang', 'nova-multiselect-filter', true);
    }
}
