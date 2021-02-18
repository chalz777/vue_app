export const vueValidityState = {
	name:"vue-validity-state",
	props: {
		targetSelector: {
			type: String
		},
		patternDescription: {
			type: String,
			default: null
		}
	},
	data: function() {
		return {
			message: '',
			title: '',
			style: /*html*/`
			<style>
			.blue {
				color: blue
			}
		</style>`
		}
	},
	mounted: function() {
		this.setData(this.getTargetElement());
	},
	beforeDestory: function() {
		this.getTargetElement().removeEventListener('input',this.update);
	},
	watch: {
		targetSelector: function(newValue,oldValue) {
			// var oldControl = document.getElementById(oldValue);
			// if(oldControl) {
			// 	oldControl.removeEventListener('input',this.update);
			// }
			this.setData(this.getTargetElement());
		}
	},
	methods: {
		getTargetElement: function() {
			if(this.targetSelector) {
				//return document.getElementById(this.targetSelector);
				console.log('el',this.$el);
				console.log('query',this.targetSelector);
				console.log('control',this.$e.parentNode.querySelector(this.targetSelector));
				return this.$el.parentNlode.querySelector(this.targetSelector);
			}
			else {
				return this.$el.previousElementSibling;
			}
		},
		update: function(e) {
			this.setData(e.target);
		},
		setData: function(ctrl) {
			this.message = '';
			if(ctrl) {
				if(this.patternDescription != null && ctrl.validity.patternMismatch) {
					this.message = this.patternDescription;
				}
				else if(ctrl.validity && ctrl.validity.valueMissing && ctrl.title) {	//For initial focus with no value use the title prop if exists to provide guidance
					this.message = ctrl.title;
				}
				else {
					this.message = ctrl.validationMessage;
				}
				ctrl.addEventListener('input',this.update);
			}
		}
	},
	template: /*html*/`
	<span class="vue-validity-state">
		<span>
			<i class="fa fa-window-close-o" style="font-size:19px;color:RED"></i>&nbsp;{{message}}
		</span>
	</span>
	`
}