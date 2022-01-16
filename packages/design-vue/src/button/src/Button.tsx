import { defineComponent, h, PropType } from 'vue'

const props = {
  type: {
    type: String as PropType<"Info" | "Warning" | "Error">
  }
}
export default defineComponent({
  name: 'Button',
  props,
  setup(props) {
    const handleClick = () => {
      alert('点击了按钮:' + props.type)
    }
    return { handleClick }
  },
  render() {
    const { $slots, handleClick } = this
    return (<div>
      <button onClick={handleClick}>
        {{
          default: $slots.default
        }}
      </button>
    </div>)
  }
})