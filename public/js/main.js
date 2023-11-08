let APP_ID = "2fec957359224ec39f4c96406b9087a6"
let token = null;
let uid = String(Math.floor(Math.random() * 10000))

let client;
let channel;

let queryString = window.location.search
let urlParams = new URLSearchParams(queryString)
let roomId = urlParams.get('room')
 
// if(!roomId){
//     // window.location = 'lobby.html'
//     //  window.location = `{{url('lobby')}}`
  
//     // window.location = `{{url('call')}}` 

//     }
// if (!roomId) {
//     var lobbyUrl = document.getElementById('lobby-link').getAttribute('data-route');
//     window.location = lobbyUrl;
// }
// if(!roomId){
//     var route = route['lobby'];
//     window.location = route;
//   }

let localStream;//my phone and cam
let remoteStream;//remote phone and cam
let peerConnection; 

const servers = {
    iceServers:[
        {
            urls:['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
        }
    ]
}

let constraints = {
    video:{
        width:{min:640, ideal:1920, max:1920},
        height:{min:480, ideal:1080, max:1080},
    },
    audio:true
}
let handleUserLeft = (MemberId) => {
     document.getElementById('user-2').style.display = 'none'
      document.getElementById('user-1').classList.remove('smallFrame')
}
 
let init = async () => {
    client = await AgoraRTM.createInstance(APP_ID)
    await client.login({uid, token})
    channel = client.createChannel(roomId)
    // channel = client.createChannel('main')
    await channel.join()
    channel.on('MemberJoined', handleUserJoined)
    channel.on('MemberLeft', handleUserLeft)

    client.on('MessageFromPeer', handleMessageFromPeer)
try{
    // localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:true})
    localStream = await navigator.mediaDevices.getUserMedia(constraints)

    document.getElementById('user-1').srcObject = localStream
    // createOffer()
   } catch (error) {
    console.error(" bem Could not start video source: " + error.message);
    }
}
 
let handleMessageFromPeer = async (message, MemberId) => {
      message = JSON.parse(message.text)
      console.log('message:',message)

    if(message.type === 'offer'){
        createPeerConnection(MemberId);
        await peerConnection.setRemoteDescription(message.offer);
        createAnswer(MemberId, message.offer)
    }
 
    if(message.type === 'answer'){
        addAnswer(message.answer)
    }
 
    if(message.type === 'candidate'){
        if(peerConnection){
          peerConnection.addIceCandidate(message.candidate)
        //....................................................................................
        // if (peerConnection.remoteDescription) {
        //     peerConnection.addIceCandidate(message.candidate).catch(error => {
        //         console.error("Error adding ICE candidate: " + error);
        //     });
        // } else {
        //     // Buffer the ICE candidate if the remote description is not set.
        //     iceCandidatesBuffer.push(message.candidate);
        // }
        //....................................................................................  
        }
    }


}

let handleUserJoined = async (MemberId) => {
    console.log('A new user joined the channel:', MemberId)
    createOffer(MemberId)
}

let createPeerConnection = async (MemberId) => {
    peerConnection = new RTCPeerConnection(servers)

    remoteStream = new MediaStream()
    document.getElementById('user-2').srcObject = remoteStream
     document.getElementById('user-2').style.display = 'block'
     document.getElementById('user-1').classList.add('smallFrame')


    if(!localStream){
        localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
        document.getElementById('user-1').srcObject = localStream
    }

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
    })
    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track)
        })
    }

    peerConnection.onicecandidate = async (event) => {
        if(event.candidate){
            client.sendMessageToPeer({text:JSON.stringify({'type':'candidate', 'candidate':event.candidate})}, MemberId)
        }
    }
}
let createOffer = async (MemberId) => {  
     await createPeerConnection(MemberId) 

    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    console.log('pass')
     client.sendMessageToPeer({text:JSON.stringify({'type':'offer', 'offer':offer})}, MemberId)
    // client.sendMessageToPeer({text:'hey!!!'}, MemberId)

}

let createAnswer = async (MemberId, offer) => {
    await createPeerConnection(MemberId)

     await peerConnection.setRemoteDescription(offer)

     let answer = await peerConnection.createAnswer()
     await peerConnection.setLocalDescription(answer)

     client.sendMessageToPeer({text:JSON.stringify({'type':'answer', 'answer':answer})}, MemberId)
}

let addAnswer = async (answer) => {
    if(!peerConnection.currentRemoteDescription){
        peerConnection.setRemoteDescription(answer)
    }
}
let leaveChannel = async () => {
    await channel.leave()
    await client.logout()
}
let toggleCamera = async () => {
    let videoTrack = localStream.getTracks().find(track => track.kind === 'video')
    if(videoTrack.enabled){
        videoTrack.enabled = false
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80)'
    }else{
        videoTrack.enabled = true
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
    }
}

let toggleMic = async () => { 
    let audioTrack = localStream.getTracks().find(track => track.kind === 'audio')
    if(audioTrack.enabled){
        audioTrack.enabled = false
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80)'
    }else{
        audioTrack.enabled = true
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(179, 102, 249, .9)'
    }
}
window.addEventListener('beforeunload', leaveChannel)
document.getElementById('camera-btn').addEventListener('click', toggleCamera)
document.getElementById('mic-btn').addEventListener('click', toggleMic)
init()