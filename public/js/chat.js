//let socket = io();

// alert(userDep+' v '+userCfo + ' c '+ix);

let signaling =  new BroadcastChannel(roomName);
let divVideoChatLobby = document.getElementById("video-chat-lobby");
let divVideoChat = document.getElementById("video-chat-room");
let joinButton = document.getElementById("join");
let userVideo = document.getElementById("user-video");
let peerVideo = document.getElementById("peer-video");
let roomInput = document.getElementById("roomName");
//let roomName;
let creator = false;
let rtcPeerConnection;
let userStream;

// Contains the stun server URL we will be using.
let iceServers = {
  iceServers: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

// joinButton.addEventListener("click", function () {
//   if (roomInput.value == "") {
//     alert("Please enter a room name");
//   } else {
//     roomName = roomInput.value;
//     socket.emit("join", roomName);
//   }
// });
// Triggered when a room is succesfully created.

//let localStream;
signaling.onmessage = e => {
  // if (!localStream) {
  //   console.log('not ready yet');
  //   return;
  // }
  switch (e.data.type) {
    case 'offer':
      handleOffer(e.data);
      break;
    case 'answer':
      handleAnswer(e.data);
      break;
    case 'candidate':
      handleCandidate(e.data);
      break;
    case 'ready':
      // A second tab joined. This tab will initiate a call unless in a call already.
      if (rtcPeerConnection) {
        console.log('already in call, ignoring');
        return;
      }
      makeCall();
      break;
    case 'bye':
      // if (rtcPeerConnection) {
        hangup();
      // }
      break;
    default:
      console.log('unhandled', e);
      break;
  }
};

if(userDep==ix){
  //alert('Got here!')
  userDepConnected();
}else if(userCfo==ix){
  //alert('Got here!')
  userCfoConnected();
}else{
  alert('You can\'t be here');
}

function userDepConnected() {
  creator = true;

  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: { width: 1280, height: 720 },
    })
    .then(function (stream) {
      /* use the stream */
      userStream = stream;
     // divVideoChatLobby.style = "display:none";
      userVideo.srcObject = stream;
      userVideo.onloadedmetadata = function (e) {
        userVideo.play();

        signaling.postMessage({type: 'ready'});
        window.addEventListener('callStarted',event=>{readyToSpeak(event.detail.ustr)});
      };
    })
    .catch(function (err) {
      /* handle the error */
      alert("Couldn't Access User Media "+err);
    });
};

// Triggered when a room is succesfully joined.

function userCfoConnected() {
  creator = false;
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: { width: 1280, height: 720 },
    })
    .then(function (stream) {
      /* use the stream */
      userStream = stream;
      //divVideoChatLobby.style = "display:none";
      userVideo.srcObject = stream;
      userVideo.onloadedmetadata = function (e) {
        userVideo.play();
      };
      // readyToSpeakTrigger(userStream);
//alert(userStream);

    signaling.postMessage({type: 'ready'});
    console.log('a '+signaling);
    Livewire.emit('readyToSpeak2',{'cd':cd,'ust':userStream});
    })
    .catch(function (err) {
      /* handle the error */
      alert("Couldn't Access User Media2 "+err);
    });
};

// Triggered when a room is full (meaning has 2 people).

// socket.on("full", function () {
//   alert("Room is Full, Can't Join");
// });

// Triggered when a peer has joined the room and ready to communicate.
// function readyToSpeakTrigger(u){
  window.livewire.on('readyToSpeak2',userStream=>{readyToSpeak(userStream[1])});
 window.addEventListener('callStarted',event=>{readyToSpeak(event.detail.ust)});
  
// }
function readyToSpeak(userStr) {
  
  if (userDep==ix) {

    navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: { width: 1280, height: 720 },
    })
    .then(function (stream) {
      /* use the stream */
      userStream = stream;
     // divVideoChatLobby.style = "display:none";
      userVideo.srcObject = stream;
      userVideo.onloadedmetadata = function (e) {
        userVideo.play();
  
        // window.addEventListener('callStarted',event=>{readyToSpeak(event.detail.ustr)});
      };
    })
    .catch(function (err) {
      /* handle the error */
      alert("Couldn't Access User Media "+err);
    });
    alert(userDep + " did it "+userStream);
    rtcPeerConnection = new RTCPeerConnection(iceServers);
    rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
    rtcPeerConnection.ontrack = OnTrackFunction;
    rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream);
    rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);
    rtcPeerConnection
      .createOffer()
      .then((offer) => {
        rtcPeerConnection.setLocalDescription(offer);
        setOffer(offer);

      Livewire.emit('setOffer2',[userStream,offer]);
      })

      .catch((error) => {
        console.log(error);
      });
  }
};

// Triggered on receiving an ice candidate from the peer.

function setCandidate(candidate) {
  let icecandidate = new RTCIceCandidate(candidate);
  rtcPeerConnection.addIceCandidate(icecandidate);
};

async function makeCall() {
  if (creator) {
    console.log('created');
    rtcPeerConnection = new RTCPeerConnection(iceServers);
    rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
    rtcPeerConnection.ontrack = OnTrackFunction;
    rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream);
    rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);
    rtcPeerConnection
      .createOffer()
      .then((offer) => {
        rtcPeerConnection.setLocalDescription(offer);
        signaling.postMessage({type: 'offer', sdp: offer.sdp});
        // socket.emit("offer", offer, roomName);
      })

      .catch((error) => {
        console.log(error);
      });
  }
}

// Triggered on receiving an offer from the person who created the room.

window.addEventListener('setOffer2',offer=>{setOffer(offer[0],offer[1])});
function setOffer(offer,userStr) {

  navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: { width: 1280, height: 720 },
  })
  .then(function (stream) {
    /* use the stream */
    userStream = stream;
   // divVideoChatLobby.style = "display:none";
    userVideo.srcObject = stream;
    userVideo.onloadedmetadata = function (e) {
      userVideo.play();

      // window.addEventListener('callStarted',event=>{readyToSpeak(event.detail.ustr)});
    };
  })
  .catch(function (err) {
    /* handle the error */
    alert("Couldn't Access User Media "+err);
  });
  if (!creator) {
    rtcPeerConnection = new RTCPeerConnection(iceServers);
    rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
    rtcPeerConnection.ontrack = OnTrackFunction;
    rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream);
    rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);
    rtcPeerConnection.setRemoteDescription(offer);
    rtcPeerConnection
      .createAnswer()
      .then((answer) => {
        rtcPeerConnection.setLocalDescription(answer);
        answered(answer);

      Livewire.emit('answered2',[answer,userStream]);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};


async function handleOffer(offer) {
  if (rtcPeerConnection) {
    console.error('existing peerconnection');
    return;
  }
  if (!creator) {
    alert('created offer')
    rtcPeerConnection = new RTCPeerConnection(iceServers);
    rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
    rtcPeerConnection.ontrack = OnTrackFunction;
    rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream);
    rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);
    await rtcPeerConnection.setRemoteDescription(offer);
    rtcPeerConnection
      .createAnswer()
      .then((answer) => {
        rtcPeerConnection.setLocalDescription(answer);
        signaling.postMessage({type: 'answer', sdp: answer.sdp});
        // socket.emit("answer", answer, roomName);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

// Triggered on receiving an answer from the person who joined the room.

window.addEventListener('answered2',answer=>{answered(answer[0])});
function answered(answer) {
  rtcPeerConnection.setRemoteDescription(answer);
};

async function handleAnswer(answer) {
  if (!rtcPeerConnection) {
    console.error('no peerconnection');
    return;
  }
  await rtcPeerConnection.setRemoteDescription(answer);
}
// Implementing the OnIceCandidateFunction which is part of the RTCPeerConnection Interface.

function OnIceCandidateFunction(e) {
  // 
  if (e.candidate) {
    //socket.emit("candidate", event.candidate, roomName);
    const message = {
      type: 'candidate',
      candidate: null,
    };
    message.candidate = e.candidate.candidate;
    message.sdpMid = e.candidate.sdpMid;
    message.sdpMLineIndex = e.candidate.sdpMLineIndex;console.log(message);
    signaling.postMessage(message);
  }

}

// Implementing the OnTrackFunction which is part of the RTCPeerConnection Interface.

function OnTrackFunction(event) {
  peerVideo.srcObject = event.streams[0];
  peerVideo.onloadedmetadata = function (e) {
    peerVideo.play();
  };
}

async function handleCandidate(candidate) {
  if (!rtcPeerConnection) {
    console.error('no peerconnection');
    return;
  }
  if (!candidate.candidate) {
    
    await rtcPeerConnection.addIceCandidate(null);
  } else {

    let icecandidate = new RTCIceCandidate(candidate);
    await rtcPeerConnection.addIceCandidate(icecandidate);
    console.log('connected to peer')
  }
}