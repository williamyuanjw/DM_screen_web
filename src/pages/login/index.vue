<template>
	<div class="login">
		<transition-loading :isShow="loadShow" />

		<div class="login-header">开源数据发展趋势仪表盘</div>

		<a-form :model="formModel" ref="loginForm" class="login-form" :rules="rules">
			<a-form-item name="userName">
				<a-input
					class="login-form-input"
					size="large"
					v-model:value="formModel.userName"
					placeholder="账号"
					@press-enter="onFinish"
				>
					<template #prefix>
						<img class="login-form-icon" src="@/assets/images/account-icon.png" />
					</template>
				</a-input>
			</a-form-item>

			<a-form-item name="passWord">
				<a-input-password
					class="login-form-input"
					size="large"
					v-model:value="formModel.passWord"
					placeholder="密码"
					@press-enter="onFinish"
				>
					<template #prefix>
						<img class="login-form-icon" src="@/assets/images/pwd-icon.png" />
					</template>
				</a-input-password>
			</a-form-item>

			<a-form-item style="text-align: center">
				<a-button size="large" class="login-form-btn" type="primary" @click="onFinish">登录</a-button>
			</a-form-item>
		</a-form>
	</div>
</template>

<script lang="ts" setup>
import { Rule } from 'ant-design-vue/lib/form';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from './service';
import headerImg from '@/assets/images/login-header.png';
import loginBgImg from '@/assets/images/login-bg.jpg';
import { FormInstance } from 'ant-design-vue/es';

type FormModel = {
	userName: string;
	passWord: string;
};

const reg = /[`~!@#$%^&*()_\-+=<>?:"{}|,\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g;
// 自定义校验规则
const validatePass = async (_rule: Rule, value: string) => {
	if (!value) {
		return Promise.reject('请输入账号或密码');
	} else if (reg.test(value)) {
		return Promise.reject('请勿输入特殊字符搞些歪门邪道');
	}
	return Promise.resolve();
};

const rules: Record<string, Rule[]> = {
	userName: [{ validator: validatePass, trigger: 'blur' }],
	passWord: [{ validator: validatePass, trigger: 'blur' }]
};

const router = useRouter();

const loadShow = ref<boolean>(true);
const imgCount = 2;
let curCount = 0;
const addImgCount = () => {
	curCount++;
	if (curCount === imgCount) {
		loadShow.value = false;
	}
};

const loadImg = () => {
	const imgArr = [loginBgImg, headerImg];
	imgArr.forEach(item => {
		const newImage = new Image();
		newImage.src = item;
		newImage.onload = () => {
			addImgCount();
		};
	});
};

const formModel = reactive<FormModel>({
	userName: 'yuan',
	passWord: '123456'
});

const loginForm = ref<FormInstance>();

// 表单提交
const onFinish = async () => {
	loginForm.value?.validateFields().then(async (formValues: any) => {
		const postData = {
			user_name: formValues.userName,
			pass_word: formValues.passWord
		};
		const res = await login(postData);
		if (res.code === 200) {
			localStorage.setItem('token', res.data.token);
			router.push('/home');
		}
	});
};

onMounted(() => {
	loadImg();
});
</script>

<style lang="scss" scoped>
.login {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	background: url('@/assets/images/login-bg.jpg') no-repeat;
	background-size: 100% 100%;

	&-header {
		position: absolute;
		top: 0;
		width: 100%;
		height: 90px;
		font-size: 36px;
		font-weight: 700;
		line-height: 75px;
		color: #ffffff;
		text-align: center;
		background: url('@/assets/images/login-header.png') center no-repeat;
		background-size: 100% 100%;
	}

	@mixin form-layout($width, $height, $padding, $inputFont, $placeFont) {
		.login-form {
			width: $width;
			height: $height;
			padding-top: $padding;

			&-input {
				&::v-deep .ant-input {
					font-size: $inputFont;

					&::placeholder {
						font-size: $placeFont;
					}
				}
			}

			&-icon {
				width: $inputFont;
			}

			&-btn {
				padding-inline: $inputFont * 5;
				font-size: $inputFont;
			}

			::v-deep .ant-btn-lg {
				height: calc($inputFont * 2 + 5px);
			}
		}
	}

	@media (max-width: 640px) {
		@include form-layout(900px, 500px, 140px, 25px, 23px);
	}

	@media (max-width: 480px) {
		.login-form {
			::v-deep .ant-form-item {
				margin-bottom: 8px;
			}
		}
	}

	&-form {
		width: 880px;
		height: 430px;
		padding: 130px 220px 0;
		margin-inline: 20px;
		background: url('@/assets/images/form-bg.png') center no-repeat;
		background-size: 100% 100%;

		&-icon {
			width: 18px;
			padding-bottom: 2px;
			margin-right: 8px;
		}

		&-input {
			background-color: #071c53;

			&::v-deep .ant-input {
				font-size: 18px;
				font-weight: bold;
				color: #ffffff;
				background-color: #071c53;

				&::placeholder {
					font-size: 16px;
					font-weight: normal;
					color: #558dfd;
				}
			}
		}

		&::v-deep .ant-form-item-has-error :not(.ant-input-disabled, .ant-input-borderless).ant-input {
			background-color: #071c53;
		}

		&::v-deep
			.ant-form-item-has-error
			:not(.ant-input-affix-wrapper-disabled, .ant-input-affix-wrapper-borderless).ant-input-affix-wrapper {
			background-color: #071c53;
		}

		&-btn {
			padding-inline: 90px;
			margin-top: 12px;
			font-size: 18px;
			font-weight: bold;
			color: #0a54ea;
			background: url('@/assets/images/btn-bg.png') center no-repeat;
			border-radius: 4px;
		}
	}
}
</style>
