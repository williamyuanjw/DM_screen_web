import { defineStore } from 'pinia';

const useInitData = defineStore('initData', {
	state: () => ({
		list: []
	})
});

export default useInitData;
