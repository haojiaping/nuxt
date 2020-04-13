<script>
import {
		mapActions
	} from 'vuex';
	export default {
		onLaunch: function() {
			let user = uni.getStorageSync('user') || {};
			if(user.userId){
				//更新登陆状态
				uni.getStorage({
					key: 'user',
					success: (res) => {
						this.saveLogin(res.data);
					}
				});
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			...mapActions(['saveLogin'])
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
