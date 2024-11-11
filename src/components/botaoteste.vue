<template>
  <button :class="['custom-button', buttonType]" @click="handleClick">
    <slot name="icon"></slot>
    <span>
      <slot></slot>
    </span>
    <div class="label">
      <slot name="label"></slot>
    </div>
  </button>
</template>

<script>
import { defineComponent, toRefs } from 'vue';

export default defineComponent({
  name: 'CustomButton',
  props: {
    buttonType: {
      type: String,
      default: 'primary', // ou 'secondary', 'danger', etc.
    },
  },
  setup(props, { emit }) {
    const { buttonType } = toRefs(props);

    const handleClick = () => {
      emit('click');
    };

    return {
      buttonType,
      handleClick,
    };
  },
});
</script>

<style scoped>
.custom-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.custom-button.primary {
  background-color: #3498db;
  color: white;
}

.custom-button.secondary {
  background-color: #95a5a6;
  color: white;
}

.custom-button.danger {
  background-color: #e74c3c;
  color: white;
}

.custom-button:hover {
  opacity: 0.9;
}

.label {
  margin-top: 5px;
  font-size: 12px;
  color: #fff;
}
</style>
