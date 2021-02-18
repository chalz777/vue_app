export const vueToast = {
	install(Vue,options) {
		Vue.mixin({
			methods: {
				toast: function(message) {
					var div = document.createElement("div");
					div.className = "vue-toast";
					div.innerText = message;
					document.body.appendChild(div);
					div.animate([{ opacity: 0},{ opacity: 1}],{
						duration: 500
					});
					window.setTimeout(() => {
						var p = div.animate([{ opacity: 1},{ opacity: 0}],{
							duration: 3000
						});
						p.onfinish = function() {
							div.remove();
						};
						
					},3000);
				}
			}
		});
	}
}

/*
export const vueToast = {
	name:'vue-toast',
	data: function() {
		return {
			show: false,
			message: null,
			messageType: "info"
		};
	},
	computed: {
		classObject: function() {
			switch(this.messageType) {
				case "error":
						return {
							"vue-toast-error": true
						};
					break;
				case "info":
				default:
					console.warn("Invalid messageType for vueToast: " + this.messageType);
					//Defualt if invalid type return as Info
					return {
						"vue-toast-info": true
					};
			}
		}
	},
	methods: {
		toast: function(message) {
			this.show = true;
		}
	},
	template: `
	<div class="vue-toast" v-bind:class="classObject" v-show="show">
		{{message}}
	</div>
	`
}
*/