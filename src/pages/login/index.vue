<template>
	<div class="login">
		<transition name="loading">
			<div id="load" v-if="loadShow">
				<div class="load_img">
					<img class="jzxz1" src="@/assets/images/jzxz1.png" />
					<img class="jzxz2" src="@/assets/images/jzxz2.png" />
				</div>
			</div>
		</transition>

		<div class="login-header">产品数据分析仪表盘系统</div>

		<a-form :model="formModel" name="loginForm" class="login-form" @finish="onFinish" :rules="rules">
			<a-form-item name="userName">
				<a-input class="login-form-input" size="large" v-model:value="formModel.userName" placeholder="账号">
					<template #prefix>
						<img class="login-form-icon" src="@/assets/images/account-icon.png" />
					</template>
				</a-input>
			</a-form-item>

			<a-form-item name="passWord">
				<a-input-password class="login-form-input" size="large" v-model:value="formModel.passWord" placeholder="密码">
					<template #prefix>
						<img class="login-form-icon" src="@/assets/images/pwd-icon.png" />
					</template>
				</a-input-password>
			</a-form-item>

			<a-form-item style="text-align: center">
				<a-button size="large" class="login-form-btn" type="primary" html-type="submit">登录</a-button>
			</a-form-item>
		</a-form>
	</div>
</template>

<script lang="ts" setup>
import { Rule } from 'ant-design-vue/lib/form';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

type FormModel = {
	userName: string;
	passWord: string;
};

// 自定义校验规则
const validatePass = async (_rule: Rule, value: string) => {
	if (value === '') {
		return Promise.reject('请输入账号或密码');
	}
	return Promise.resolve();
};

const rules: Record<string, Rule[]> = {
	userName: [{ validator: validatePass, trigger: 'change' }],
	passWord: [{ validator: validatePass, trigger: 'change' }]
};

const router = useRouter();

const loadShow = ref<boolean>(true);
const formModel = reactive<FormModel>({
	userName: 'admin',
	passWord: '123456'
});

// 表单提交
const onFinish = async (values: FormModel) => {
	values.userName === 'admin' && values.passWord === '123456' && router.push('/home');
};

// 模拟加载
setTimeout(() => {
	loadShow.value = false;
}, 1000);
</script>

<style lang="scss" scoped>
@keyframes xz1 {
	from {
		transform: rotate(0deg);
	}
	50% {
		transform: rotate(180deg);
	}
	to {
		transform: rotate(360deg);
	}
}
@keyframes xz2 {
	from {
		transform: rotate(0deg);
	}
	50% {
		transform: rotate(-180deg);
	}
	to {
		transform: rotate(-360deg);
	}
}
.loading-enter,
.loading-leave-to {
	opacity: 0;
}
.loading-enter-to,
.loading-leave {
	opacity: 1;
}
.loading-enter-active,
.loading-leave-active {
	transition: all 2s;
}
.login {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	background: url('@/assets/images/login-bg.jpg') no-repeat;
	background-size: 100% 100%;
	#load {
		position: absolute;
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background: url('@/assets/images/load-bg.png') no-repeat;
		background-size: cover;
		.load_img {
			.jzxz1 {
				position: absolute;
				animation: xz1 8s infinite linear;
			}
			.jzxz2 {
				animation: xz2 7s infinite linear;
			}
		}
	}
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
