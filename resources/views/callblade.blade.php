<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>PeerChat</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <!-- <link rel='stylesheet' type='text/css' media='screen' href='main.css'> -->
    <link rel="stylesheet" href="{{ asset('css/main.css') }}">
</head>
<body>
    
    <div id="videos">
        <video class="video-player" id="user-1" autoplay playsinline></video>
        <video class="video-player" id="user-2" autoplay playsinline></video>
    </div>
    <div id="controls">
        <div class="control-container" id="camera-btn">
            <!-- <img src="icons/camera.png" /> -->
            <img src="{{ asset('icons/camera.png') }}" alt="cam">
            
        </div>
        <div class="control-container" id="mic-btn">
            <!-- <img src="icons/mic.png" /> -->
            <img src="{{ asset('icons/mic.png') }}" alt="phone">

        </div>
        <a href="{{ url('lobby') }}">
            <div class="control-container" id="leave-btn">
                <!-- <img src="icons/phone.png" /> -->
                <img src="{{ asset('icons/phone.png') }}" alt="call">
            </div>
        </a>
    </div>  
<!-- TO HELP main.js LINE 12-24 TO WORK -->
    <div id="lobby-link" data-route="{{ route('lobby')}}"></div>
    <!-- <div id="lobby-link" data-route="{{ route('lobby')}},"></div> -->

   
</body>

<script src="{{ asset('js/agora-rtm-sdk-1.4.4.js') }}"></script>
<script src="{{ asset('js/main.js') }}"></script>
<!-- <script src="routes.js"></script> -->
<script src="{{ asset('js/ziggy.js') }}"> </script>
</html>