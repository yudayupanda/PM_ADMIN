const common = {
	state:{
		isCollapsed:false,
	},
	mutations:{
		toggleSiderBar(state) {
            state.isCollapsed = !state.isCollapsed
        }
	}
}
export default common