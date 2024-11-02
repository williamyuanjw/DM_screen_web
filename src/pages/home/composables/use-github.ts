import { reactive } from 'vue';

export type GitHubItem = {
	project_id: number;
	influence: string;
	response: string;
	activity: string;
	trend: string;
	github: string;
	name: string;
	sort_id: number;
};

type GitHubType = {
	loading: boolean;
	dataSource: GitHubItem[];
	addData: () => void;
	page: number;
	page_size: number;
	total: number;
};

export default function (): GitHubType {
	// const githubStore = useGithubStore();
	const addData = () => {
		// 分页操作
		// if (github.dataSource.length < github.total || github.dataSource.length === 0) {
		// 	github.loading = true;
		// 	github.page++;
		// 	getGithubData({
		// 		page: github.page,
		// 		page_size: github.page_size
		// 	})
		// 		.then(res => {
		// 			github.total = res.data.total || 0;
		// 			github.dataSource = [...github.dataSource, ...res.data.list];
		// 			githubStore.list = github.dataSource;
		// 		})
		// 		.catch(() => {
		// 			github.page--;
		// 		})
		// 		.finally(() => {
		// 			github.loading = false;
		// 		});
		// }
	};
	const github = reactive<GitHubType>({
		loading: true,
		dataSource: [],
		addData,
		page: 0,
		page_size: 25,
		total: 0
	});
	return github;
}
