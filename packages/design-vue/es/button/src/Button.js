import { defineComponent, h } from 'vue';
const props = {
    type: {
        type: String
    }
};
export default defineComponent({
    name: 'Button',
    props,
    setup(props) {
        const handleClick = () => {
            alert('点击了按钮:' + props.type);
        };
        return { handleClick };
    },
    render() {
        const { $slots, handleClick } = this;
        return (h("div", null,
            h("button", { onClick: handleClick }, {
                default: $slots.default
            })));
    }
});
