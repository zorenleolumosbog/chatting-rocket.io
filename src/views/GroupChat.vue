<script>
import { reactive, onMounted, onUnmounted } from 'vue'
import io from 'socket.io-client'

export default {
  setup() {
    const socket = io('http://localhost:3000')
    const state = reactive({
      message: '',
      messages: []
    });

    onMounted(() => {
      socket.on('message', (data) => {
        state.messages.push(data)
      })
    })

    onUnmounted(() => {
      socket.disconnect()
    })

    const sendMessage = () => {
      if (state.message) {
        socket.emit('message', state);
        state.message = '';
      }
    }

    return {
      state,
      sendMessage
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-4">
      </div>
      <div class="col-md-4">
        <h1>Chat</h1>
        <div class="shadow p-3 mb-1 bg-body-tertiary rounded">
          <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="message in state.messages" :key="message">
              {{ message }}
            </li>
          </ul>
        </div>
        <form @submit.prevent="sendMessage">
          <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="Enter message" v-model="state.message" />
            <button type="submit" class="btn btn-primary">Send</button>
          </div>
        </form>
      </div>
      <div class="col-md-4">
      </div>
    </div>
  </div>
</template>
