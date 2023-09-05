import { reactive } from 'vue';

type GitHubType = {
	loading: boolean;
	dataSource: { id: number; content: string }[];
	addData: () => void;
};

export default function (): GitHubType {
	const addData = () => {
		github.loading = true;
		setTimeout(() => {
			const newData = [];
			for (let i = 0; i < 25; i++) {
				const len: number = github.dataSource.length + newData.length;
				newData.push({
					id: len,
					content: 'test' // 内容
				});
			}
			github.dataSource = [...github.dataSource, ...newData];
			github.loading = false;
		}, 2000);
	};

	const github = reactive<GitHubType>({
		loading: false,
		dataSource: [],
		addData
	});

	return github;
}
