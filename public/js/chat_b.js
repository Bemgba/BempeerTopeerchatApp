let socket = io(ich, {
  'withCredentials': false});
  /*
  Access to XMLHttpRequest at 'http://127.0.0.1:4003/socket.io/?EIO=3&transport=polling&t=OOEZg-J' from origin 'http://127.0.0.1:8003' has been blocked by CORS policy: The value of the 'Access-Control-Allow-Credentials' header in the response is '' which must be 'true' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.

  */
let divVideoChatLobby = document.getElementById("video-chat-lobby");
let divVideoChat = document.getElementById("video-chat-room");
let joinButton = document.getElementById("join");
let userVideo = document.getElementById("user-video");
let loader = document.getElementById("loader");
let peerVideo = document.getElementById("peer-video");
let roomInput = document.getElementById("roomName");
// let roomName;
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

// alert(roomName);
if(userDep==ix){
  //alert('Got here!')
  socket.emit("join", roomName);
  socket.emit('readyToSpeak2',{'cd':cd,'cf': userCfo,'cn':roomName});
  // userDepConnected();
}else if(userCfo==ix){
  // alert('Got here!')
  socket.emit("join", roomName);
   userCfoConnected();
}else{
  alert('You can\'t be here');
}

// Triggered when a room is succesfully created.

socket.on("created", function () {
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
      };

    Livewire.emit('readyToSpeak2',{'cd':cd,'usrd':userDep});
    })
    .catch(function (err) {
      /* handle the error */
      alert("Couldn't Access User Media user "+err);
    });
});

// Triggered when a room is succesfully joined.

socket.on("joined", function () {
  creator = false;

  // alert('came back')
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
      };
      socket.emit("ready", roomName);
    })
    .catch(function (err) {
      /* handle the error */
      alert("Couldn't Access User Media cfo "+err);
    });
});

// Triggered when a room is full (meaning has 2 people).

socket.on("full", function () {
  alert("Call is ongoing, You Can't Join");
});

// Triggered when a peer has joined the room and ready to communicate.

socket.on("ready", function () {
  if (creator) {
    rtcPeerConnection = new RTCPeerConnection(iceServers);
    rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
    rtcPeerConnection.ontrack = OnTrackFunction;
    rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream);
    rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);
    rtcPeerConnection
      .createOffer()
      .then((offer) => {
        rtcPeerConnection.setLocalDescription(offer);
        socket.emit("offer", offer, roomName);
      })

      .catch((error) => {
        console.log(error);
      });
  }
});

// Triggered on receiving an ice candidate from the peer.

socket.on("candidate", function (candidate) {
  let icecandidate = new RTCIceCandidate(candidate);
  rtcPeerConnection.addIceCandidate(icecandidate);
});

// Triggered on receiving an offer from the person who created the room.

socket.on("offer", function (offer) {

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
        socket.emit("answer", answer, roomName);

    $('#loader').hide();
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

// Triggered on receiving an answer from the person who joined the room.

socket.on("answer", function (answer) {

  $('#loader').hide();
  Livewire.emit('callStart',{'cd':cd,'cf':userCfo,'cu':userDep});
  rtcPeerConnection.setRemoteDescription(answer);
});

// Implementing the OnIceCandidateFunction which is part of the RTCPeerConnection Interface.

function OnIceCandidateFunction(event) {
  console.log("Candidate");
  if (event.candidate) {
    socket.emit("candidate", event.candidate, roomName);
  }
}

// Implementing the OnTrackFunction which is part of the RTCPeerConnection Interface.

function OnTrackFunction(event) {
  peerVideo.srcObject = event.streams[0];
  peerVideo.onloadedmetadata = function (e) {
    peerVideo.play();
  };
}

const tryButton = document.getElementById('tryButton');
tryButton.onclick = () => {
  
  // let url = "/";
  location.reload(true);
};

const hangupButton = document.getElementById('hangupButton');
hangupButton.onclick = async () => {
  hangup();
};

async function hangup() {
  socket.emit('leave',roomName);

  Livewire.emit('callEnd',{'cd':cd,'cf':userCfo,'cu':userDep});
  if(userStream.srcObject){
    userStream.getTracks().forEach(track => track.stop());
    
  userStream = null;
  }
  if(peerVideo != null){
  peerVideo.srcObject.getTracks().forEach(track => track.stop());
    
  peerVideo = null;
  }else{
    alert('Call ended already.')
  }
  if(rtcPeerConnection){
    rtcPeerConnection.ontrack = null;
    rtcPeerConnection.onicecandidate = null;
    rtcPeerConnection.close();
    rtcPeerConnection = null;
  }


  let url = "/";
  $(location).attr('href',url);
};
socket.on("leave", function () {


  Livewire.emit('callEnd',{'cd':cd,'cf':userCfo,'cu':userDep});

    if(peerVideo.srcObject){
    peerVideo.srcObject.getTracks().forEach(track => track.stop());
    peerVideo = null;
    }

    if(rtcPeerConnection){
      rtcPeerConnection.ontrack = null;
      rtcPeerConnection.onicecandidate = null;
      rtcPeerConnection.close();
      rtcPeerConnection = null;
    }
});

