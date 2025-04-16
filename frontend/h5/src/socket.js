// socket.js
import { Stomp } from '@stomp/stompjs';

let stompClient;

export const connectStomp = (onMessageCallback) => {
    const token = sessionStorage.getItem("access_token");
    const socket = new WebSocket(`wss://hi-five.site/api/ws?accessToken=Bearer ${token}`);
    stompClient = Stomp.over(socket);

    stompClient.reconnectDelay = 5000;
    stompClient.heartbeat.outgoing = 20000;
    stompClient.heartbeat.incoming = 0;

    stompClient.connect({}, (frame) => {
        console.log('STOMP 연결 성공:', frame);

        // /user/queue/alarms 구독
        stompClient.subscribe('/user/queue/alarms', (message) => {
            console.log("STOMP 메시지 수신:", message.body);
            // 콜백 함수에 메시지를 넘겨주어, React 컴포넌트 쪽에서 처리하게 함
            if (onMessageCallback) {
                onMessageCallback(message.body);
            }
        });

    }, (error) => {
        console.error("STOMP 연결 오류:", error);
    });
};

// socket.js
export const disconnectStomp = () => {
    if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
            console.log("STOMP 연결 종료");
        });
    }
};


export const sendNotification = (targetUser, message) => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: '/app/send-notification',
            body: JSON.stringify({ targetUser, message })
        });
    } else {
        console.error('STOMP 연결이 되지 않았습니다.');
    }
};
