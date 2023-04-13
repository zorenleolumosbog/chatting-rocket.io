<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import io from 'socket.io-client'

export default {
  setup() {
    const socket = io('http://localhost:3000');
    const isJoin = ref(false);
    const state = reactive({
        senderId: '',
        recipientId: '',
        message: ''
    });

    const messages = reactive([]);

    onMounted(() => {
        socket.on('message', (data) => {
            if (data.senderId && data.recipientId) {
                messages.push(data);
            }
        })
    })

    onUnmounted(() => {
      socket.disconnect();
    })

    const joinSender = () => {
        if (state.senderId && state.recipientId) {
            socket.emit('join', state.senderId);
            isJoin.value = true;
        }
    }

    const sendMessage = () => {
        if (state.senderId && state.recipientId && state.message) {
            socket.emit('message', state);
            state.message = '';
        }
    }

    return {
        isJoin,
        state,
        messages,
        joinSender,
        sendMessage
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
      </div>
      <div class="col-md-6">
        <h1>Chat</h1>
        <form v-if="!isJoin" @submit.prevent="joinSender">
          <div class="input-group mb-3">
            <input type="number" class="form-control" placeholder="Sender ID" v-model="state.senderId" />
            <input type="number" class="form-control" placeholder="Recipient ID" v-model="state.recipientId" />
            <button type="submit" class="btn btn-primary">Join</button>
          </div>
        </form>
        <template v-if="isJoin">
            <div class="shadow p-3 mb-1 bg-body-tertiary rounded">
            <ul>
                <li v-for="(message, index) in messages" :key="index">
                    <div :class="{
                        'float-start': state.senderId == message.senderId,
                        'float-end': state.senderId != message.senderId
                    }">
                        {{ message.senderId }}: {{ message.message }}
                    </div>
                </li>
            </ul>
            </div>
            <form @submit.prevent="sendMessage">
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Enter message" v-model="state.message" />
                <button type="submit" class="btn btn-primary">Send</button>
            </div>
            </form>
        </template>
      </div>
      <div class="col-md-3">
      </div>
    </div>
  </div>
</template>
