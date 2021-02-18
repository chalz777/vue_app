const modalDialog = {
    name:'modal-dialog',
    template:`<transition name="modal-fade">
	<div class="modal-backdrop">
		<div class="modal" v-bind:class="state" v-bind:style="{width:width}">
			<header class="modal-header">
				<slot name="header">
					<h2>{{title}}</h2>
					<button type="button" class="btn-close" v-on:click="close">
						<span>&times; </span>
					</button>
				</slot>
			</header>
			<section class="modal-body">
				<slot></slot>
			</section>
			<footer class="modal-footer">
				<slot name="footer"></slot>
				<button type="button" v-on:click="close" v-show="showCloseButton" class="btn btn-default">{{closeButtonText}}</button>
			</footer>
		</div>
	</div>
</transition>`,
    props: {
        title: {
            type: String,
            default: 'Modal'
        },
        showCloseButton: {
            type: Boolean,
            default: true
        },
        closeButtonText: {
            type: String,
            default: 'Cancel'
        },
        state: {
            type: String,
            default: 'info'
        },
        width: {
            type: String,
            default: '40%'
        }
    },
    methods: {
        close: function () {
            this.$emit('close');
        }
    }
}

export {modalDialog};