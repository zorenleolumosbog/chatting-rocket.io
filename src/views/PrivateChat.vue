<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import io from 'socket.io-client'

export default {
  setup() {
    const socket = io('http://localhost:3000');
    const isJoin = ref(false);
    const isTyping = ref(false);
    const state = reactive({
        senderId: '',
        recipientId: '',
        message: '',
        seen: false
    });
    const messages = reactive([]);

    onMounted(() => {
        socket.on('typing', (senderId) => {
            if (senderId === state.recipientId) {
                isTyping.value = true;
            }
            setTimeout(() => {
                isTyping.value = false;
            }, 1000);
        });

        socket.on('message', (data) => {
            if (data.senderId && data.recipientId) {
                data.seen = false;
                messages.push(data);
                
                // socket.emit('messageSeen', messages, data);
            }
        });
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
    
    const onTyping = () => {
        socket.emit('typing', state);
    }

    const sendMessage = () => {
        if (state.senderId && state.recipientId && state.message) {
            state.seen = false;
            socket.emit('message', state);
            state.message = '';
        }
    }

    return {
        isJoin,
        isTyping,
        state,
        messages,
        joinSender,
        onTyping,
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
            <ul class="list-group list-group-flush">
                <li class="list-group-item" v-for="(message, index) in messages" :key="index">
                    <div :class="{
                        'float-start': state.senderId == message.senderId,
                        'float-end': state.senderId != message.senderId
                    }">
                        <strong>{{ state.senderId == message.senderId ? 'Me' : 'Recip'}}:</strong> {{ message.message }}
                    </div>
                    <div v-if="message.seen" class="d-block float-end h6">seen</div> 
                </li>
                <li v-if="isTyping" class="list-group-item">
                    <div class="float-end h6">{{ state.recipientId }} is typing...</div> 
                </li>
            </ul>
            </div>
            <form @submit.prevent="sendMessage">
            <div class="input-group mb-3">
                <input @keydown="onTyping" type="text" class="form-control" placeholder="Enter message" v-model="state.message" />
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
