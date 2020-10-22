import MultiselectFilter from './components/MultiselectFilter';

Nova.booting((Vue, router, store) => {
  Vue.component('nova-multiselect-filter', MultiselectFilter);
});
