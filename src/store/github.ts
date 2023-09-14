import { GitHubItem } from '@/pages/home/composables/use-github';
import { defineStore } from 'pinia';

const useGithubStore = defineStore('github', {
	state: () => ({
		list: [] as GitHubItem[]
	})
});

export default useGithubStore;
