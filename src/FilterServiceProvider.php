<?php declare(strict_types=1);


namespace OptimistDigtal\NovaMultiselectFilter;

use Illuminate\Support\ServiceProvider;
use Laravel\Nova\Events\ServingNova;
use Laravel\Nova\Nova;
use OptimistDigital\NovaTranslationsLoader\LoadsNovaTranslations;

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
