import { defineStore } from 'pinia';

const useOptionStore = defineStore('option', {
	state: () => ({
		option: []
	})
});

export default useOptionStore;
