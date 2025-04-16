// import { useEffect, useRef } from 'react';
// import { connectStomp } from '../../socket';
// import { Toast } from 'primereact/toast';
// import { IdFind } from '../../pages/Auth/IdFind'

// const NotificationComponent = () => {
//   const toast = useRef(null);

//   const idfind = IdFind()
//   console.log(idfind)


//   useEffect(() => {
//     // STOMP 연결 및 구독 설정
//     const client = connectStomp();

//     // 알림 메시지가 수신되면 토스트 표시
//     client.onConnect = () => {
//       client.subscribe('/user/queue/notifications', (message) => {
//         console.log('알림 수신:', message.body);

//         // 수신된 알림 메시지를 토스트로 표시
//         // 이렇게 구별해도 되나..?
//         if (isCounselor) {
//           toast.current.show({
//             severity: '알림',
//             summary: '상담사가 입장했습니다!',
//             life: 5000
//           });
//         } else if(isParent) {
//           toast.current.show({
//             severity: '알림',
//             summary: '상담자(학부모)가 입장했습니다!',
//             life: 5000
//           });
//         }
//         else{
//           toast.current.show({
//             severity: '알림',
//             summary: '상담자(아동)가 입장했습니다!',
//           })
//         }
//       })
//     } 
    
//   });  // 최 상단에 두기 때문에 deactive 필요없음


//   return <Toast ref={toast} />;
// };

// export default NotificationComponent;
