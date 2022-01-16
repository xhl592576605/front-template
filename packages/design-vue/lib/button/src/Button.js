"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const props = {
    type: {
        type: String
    }
};
exports.default = (0, vue_1.defineComponent)({
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
        return ((0, vue_1.h)("div", null,
            (0, vue_1.h)("button", { onClick: handleClick }, {
                default: $slots.default
            })));
    }
});
